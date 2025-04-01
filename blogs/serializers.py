from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Blog, Comment
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.models import User
from .utils import send_verification_email 
from django.db.models import Q  


User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")  
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError({"error": "Email and password are required."})

        user = User.objects.filter(email=email).first()
        if not user or not user.check_password(password):
            raise serializers.ValidationError({"error": "Invalid email or password."})

        if not user.is_active:
            send_verification_email(self.context['request'], user) 
            raise serializers.ValidationError({
                "error": "Your account is not verified. Please verify your email.",
                "resend_verification": True
            })

        data = super().validate(attrs)  

        data["user"] = {
            "id": user.id,
            "name": user.username,
            "email": user.email,
        }
        return data


class UserSerializer(serializers.ModelSerializer):  
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}


    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])  
        user.save()
        return user



class BlogSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.username", read_only=True)
    image = serializers.ImageField(required=True)


    class Meta:
        model = Blog
        fields = ["id", "title", "description", "image", "author", "created_at"]
        read_only_fields = ["id", "author", "created_at"]

    def to_internal_value(self, data):
        if "image" not in data or not data["image"]:
            raise serializers.ValidationError({"image":["image required to create"]})
        return super().to_internal_value(data)

    def update(self, instance, validated_data):
        request = self.context.get("request")

        print("Validated Data:", validated_data)

        
        if request and request.user != instance.author:
            raise serializers.ValidationError("You can only edit your own blogs.")

        
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        if "image" in validated_data:
            instance.image = validated_data["image"]

        instance.save()
        return instance
    
    def get_author(self, obj):

        return {
            "id": obj.author.id,
            "username": obj.author.username,
            "email": obj.author.email
        }

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()  
    blog = serializers.PrimaryKeyRelatedField(queryset=Blog.objects.all(), write_only=True)

    class Meta:
        model = Comment
        fields = ["id", "blog", "user", "content", "created_at"]

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "username": obj.user.username,
            "email": obj.user.email
        }
    def get_blog(self, obj):  
        return {
            "id": obj.blog.id,
            "title": obj.blog.title,
            "author": obj.blog.author.username
        }


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        user = User.objects.filter(email=value).first()
        if not user:
            raise serializers.ValidationError("User with this email does not exist.")

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_url = f"http://localhost:3000/reset-password/{uid}/{token}/"
        subject = "Password Reset Request"
        message = f"Hi {user.username},\n\nClick the link below to reset your password:\n{reset_url}\n\nIf you did not request this, please ignore this email."
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])  
        
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, min_length=6)

    def save(self, user):
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user