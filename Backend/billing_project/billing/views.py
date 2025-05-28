from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import PhoneRegisterSerializer, OTPLoginSerializer

otp_store = {}  # Replace with Redis or DB for prod

class RegisterPhoneView(APIView):
    def post(self, request):
        serializer = PhoneRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Send OTP (dev: fixed OTP)
        otp_store[user.phone_number] = "123456"
        print(f"OTP for {user.phone_number}: 123456")

        return Response({'message': 'OTP sent.'}, status=201)

class LoginWithOTPView(APIView):
    def post(self, request):
        serializer = OTPLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data['phone_number']
        otp = serializer.validated_data['otp']

        if otp_store.get(phone) != otp:
            return Response({'detail': 'Invalid OTP'}, status=400)

        try:
            user = CustomUser.objects.get(phone_number=phone)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'User not found'}, status=404)

        user.isphoneauth = True
        user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
