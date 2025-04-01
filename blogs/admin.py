from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Blog, Comment

# Register your models here.
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('username', 'email', 'is_staff', 'is_active')
    search_fields = ('email',)
    ordering = ('email',)

admin.site.register(User, CustomUserAdmin)
admin.site.register(Blog)
admin.site.register(Comment)