#Third Party Modules
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

#Django Modules
from django.urls import path

#Custom Defined Modules
from .views import *




urlpatterns = [
 
    #Accounts 
    path("login/", MyObtainTokenPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", UserLogoutView.as_view(), name="logout"),
]