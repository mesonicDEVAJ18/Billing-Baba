from rest_framework import serializers
from .models import CustomUser

class PhoneRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('phone_number', 'username')

    def create(self, validated_data):
        user, created = CustomUser.objects.get_or_create(
            phone_number=validated_data['phone_number'],
            defaults={'username': validated_data['username']}
        )
        return user

class OTPLoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    otp = serializers.CharField()
