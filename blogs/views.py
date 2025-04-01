
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model, logout, authenticate
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import smart_bytes
from django.contrib.sites.shortcuts import get_current_site
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import EmailMessage
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.encoding import smart_str
from django.utils.http import urlsafe_base64_decode
from .serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from django.utils.timezone import now
from datetime import timedelta

from .utils import send_verification_email 
from rest_framework import generics 
from rest_framework.pagination import PageNumberPagination

from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView

from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets, permissions, status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Blog, Comment
from .serializers import (
    UserSerializer,
    BlogSerializer,
    CommentSerializer,
    CustomTokenObtainPairSerializer
)

User = get_user_model()


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

        
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False  
            user.save()

            send_verification_email(request, user)
            return Response({"message": "Verification email sent. Check your inbox."}, status=status.HTTP_201_CREATED)
        
        existing_user = User.objects.filter(email=request.data.get("email")).first()
        if existing_user and not existing_user.is_active:
            send_verification_email(request, existing_user)
            return Response({"message": "Verification email resent. Check your inbox."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class VerifyEmailView(APIView):
    permission_classes = [AllowAny]  

    def get(self, request, uidb64, token):
        try:
            uid = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            
            if user.verification_expires_at and now() > user.verification_expires_at:
                return Response({
                    "error": "Verification link expired. Request a new one."
                }, status=status.HTTP_400_BAD_REQUEST)

            
            if default_token_generator.check_token(user, token):
                user.is_active = True
                user.verification_expires_at = None
                user.save()

                
                refresh = RefreshToken.for_user(user)

                return Response({
                    "message": "Email verified successfully!",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }, status=status.HTTP_200_OK)

            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
  
        except User.DoesNotExist:
            return Response({"error": "Invalid user."}, status=status.HTTP_400_BAD_REQUEST)


class ResendVerificationEmailView(APIView):
    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)

            if user.is_active:
                return Response({"message": "User already verified."}, status=status.HTTP_400_BAD_REQUEST)

            send_verification_email(request, user)

            return Response({"message": "New verification email sent."}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]  

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            return Response({"message": "Password reset link has been generated.Check your inbox."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]  
    def post(self, request, uidb64, token):
        try:
            
            uid = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.filter(pk=uid).first()
            if not user:
                return Response({"error": "Invalid user."}, status=status.HTTP_400_BAD_REQUEST)

            
            if not default_token_generator.check_token(user, token):
                return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

            
            serializer = PasswordResetConfirmSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user)
                return Response({"message": "Password reset successful. You can now log in."}, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BlogPagination(PageNumberPagination):
    page_size = 9  
    page_size_query_param = 'page_size'
    max_page_size = 20 * 8 

class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all().order_by('-created_at')
    serializer_class = BlogSerializer
    pagination_class = BlogPagination


    def update(self, request, *args, **kwargs):
        blog = get_object_or_404(Blog, pk=kwargs["pk"])


        if blog.author != request.user:
            return Response({"error": "Unauthorized: You can only update your own blogs."}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(blog, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def destroy(self, request, *args, **kwargs):
        blog = get_object_or_404(Blog, pk=kwargs["pk"])


        if blog.author != request.user:
            return Response({"error": "Unauthorized: You can only delete your own blogs."}, status=status.HTTP_403_FORBIDDEN)

        Comment.objects.filter(blog=blog).delete()
        blog.delete()
        return Response({"message": "Blog and its comments deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by("-created_at")
    serializer_class = CommentSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        blog_id = self.request.query_params.get("blog")
        if blog_id:
            return Comment.objects.filter(blog_id=blog_id).order_by("-created_at")
        return Comment.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        blog_id = self.request.data.get("blog")

        if not blog_id:
            raise ValidationError({"blog": "This field is required."})

        try:
            blog = Blog.objects.get(pk=int(blog_id))
        except (ValueError, Blog.DoesNotExist):
            raise ValidationError({"blog": "Invalid blog ID."})

        serializer.save(user=self.request.user, blog=blog)

    def destroy(self, request, *args, **kwargs):
        comment = get_object_or_404(Comment, pk=kwargs["pk"])

        if comment.user != request.user:
            return Response(
                {"error": "Unauthorized: You can only delete your own comments."},
                status=status.HTTP_403_FORBIDDEN
            )

        comment.delete()
        return Response({"message": "Comment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    

class MyBlogsView(ListAPIView):
    serializer_class = BlogSerializer
    pagination_class = BlogPagination
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
  

    def get_queryset(self):
        return Blog.objects.filter(author=self.request.user).order_by("-created_at")



class BlogDetailView(generics.RetrieveAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    pagination_class = BlogPagination


class CreateBlogView(generics.CreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user) 