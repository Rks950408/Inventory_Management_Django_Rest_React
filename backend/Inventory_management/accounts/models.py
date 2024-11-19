from django.db import models

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=False)
    contact_no = models.CharField(max_length=12, null=True)
    username = models.CharField(max_length=100, null=False, unique=True)
    password = models.CharField(max_length=120, null=False)
    email = models.CharField(max_length=100, null=True)
    status = models.IntegerField(default=1)  # 1 = Active, 0 = Inactive
    update_pswd = models.IntegerField(null=False, default=0)  # Password update flag
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set at creation
    updated_at = models.DateTimeField(auto_now=True)  # Automatically set on update

    def __str__(self):
        return self.username
