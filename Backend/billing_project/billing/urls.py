from django.urls import path
from .views import RegisterPhoneView, LoginWithOTPView

urlpatterns = [
    path('api/auth/register/', RegisterPhoneView.as_view()),
    path('api/auth/login-otp/', LoginWithOTPView.as_view()),
]
