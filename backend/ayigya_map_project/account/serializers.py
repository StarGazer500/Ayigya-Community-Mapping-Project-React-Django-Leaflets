from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed

from .models import CustomUserModel



# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         if user.role == "Normal User":
#             token = super(MyTokenObtainPairSerializer, cls).get_token(user)
#             token["email"] = user.email
#             token["full_name"] = user.full_name
            
        
#             return token
#         else:
#             raise AuthenticationFailed("Invalid Credential")

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)
        token["email"] = user.email
        token["full_name"] = user.full_name
        return token
        # else:
        #     raise AuthenticationFailed("Invalid Credential")




    


