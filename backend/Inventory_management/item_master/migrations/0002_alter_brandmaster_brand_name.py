# Generated by Django 5.1.3 on 2024-11-08 09:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('item_master', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='brandmaster',
            name='brand_name',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]