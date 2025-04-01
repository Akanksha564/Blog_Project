from django.db import models
from django.utils.timezone import now, timedelta


from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)  
    created_at = models.DateTimeField(auto_now_add=True)  
    verification_expires_at = models.DateTimeField(null=True, blank=True) 

    USERNAME_FIELD = 'email'  
    REQUIRED_FIELDS = ['username']

    def is_verification_expired(self):
        """Check if the email verification link has expired (5-min limit)."""
        return self.verification_expires_at and now() > self.verification_expires_at


class Blog(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='blog_images/', null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.title

class Comment(models.Model):  
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    blog = models.ForeignKey('Blog', on_delete=models.CASCADE)
    content = models.TextField()  
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.user.username} - {self.blog.title}"