from django.shortcuts import render
from .serializers import *
from rest_framework.views import APIView
from account.custom_jwt_auth import CustomJWTAuthentication
from rest_framework.permissions import IsAdminUser,IsAuthenticated,AllowAny,IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.views import TokenObtainPairView
# Create your views here.

#Obtain normal user token for authentication
class MyObtainTokenPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        print("res",response)
        access_token = response.data['access']
        refresh_token = response.data['refresh']
        request.session['access_token'] = response.data['access']
        request.session['refresh_token'] = response.data['refresh']
        print("this is saved session",request.session.get('access_token'))
        request.session.save()
        return response


class CallView(APIView):
    authenticate_class = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        # Check if the request.user is authenticated
        user = request.user
    
        print(f"Request user: {user}")
        # return Response({"message":"loaded"})
        print(user.is_authenticated)


        if user and user.is_authenticated and (user.role == "SuperUser Admins" or user.role == "Other Admins"):
            print( "user_id", user.id)
            print("full_name", user.full_name)
            # Return the user's ID and full name (assuming 'get_full_name' method exists in the model)
            return Response({
                "message": "User is authenticated",
                "user_id": user.id,
                "full_name": user.full_name
            }, status=210)
        
        elif user and user.is_authenticated and user.role == "Normal User":
            print( "user_id", user.id)
            print("full_name", user.full_name)
            # Return the user's ID and full name (assuming 'get_full_name' method exists in the model)
            return Response({
                "message": "User is authenticated",
                "user_id": user.id,
                "full_name": user.full_name
            }, status=220)
            
        else:
            # If user is not authenticated
            return Response({"message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


#Logout normal user
class UserLogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
