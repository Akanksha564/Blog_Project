from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailOrUsernameBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        print(f"Trying to authenticate: {username}")
        
        if username is None or password is None:
            print("No username or password provided")
            return None

        user = User.objects.filter(email=username).first() or User.objects.filter(username=username).first()

        if user:
            print(f"Found user: {user.email}")
            if user.check_password(password):
                print("Password is correct")
                return user
            else:
                print("Incorrect password")
        else:
            print("User not found")

        return None
