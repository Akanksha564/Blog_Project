from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.conf import settings
from django.utils.timezone import now
from datetime import timedelta

def send_verification_email(request, user):
    """Generates a verification token and sends an email with a expiry link."""
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    current_site = get_current_site(request).domain
    verification_url =  f"http://localhost:3000/verify-akanksha/{uid}/{token}/"      

    subject = "Verify Your Email (Expires in 5 minutes)"
    message = f"Click the link to verify your email (valid for 5 minutes): {verification_url}"
    
    send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])

    user.verification_expires_at = now() + timedelta(minutes=5)
    user.save()
