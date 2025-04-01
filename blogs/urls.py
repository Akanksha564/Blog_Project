
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, LogoutView, BlogViewSet,
    CommentViewSet, VerifyEmailView, PasswordResetRequestView,
    PasswordResetConfirmView, ResendVerificationEmailView,CreateBlogView,MyBlogsView
)

# ✅ Set up the router for blog and comment APIs
router = DefaultRouter()
router.register(r'blogs', BlogViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/verify-akanksha/<uidb64>/<token>/', VerifyEmailView.as_view(), name='verify-email'),
    path("auth/reset-password/", PasswordResetRequestView.as_view(), name="password_reset_request"),
    path("auth/reset-password/<str:uidb64>/<str:token>/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path('auth/resend-verification/', ResendVerificationEmailView.as_view(), name='resend-verification'),
    path('create-blogs/', CreateBlogView.as_view(), name='create-blog'),
    path('my-blogs/', MyBlogsView.as_view(), name='my-blogs'),
    path('', include(router.urls)),
]
