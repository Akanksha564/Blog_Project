# Generated by Django 5.1.7 on 2025-03-18 05:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0002_user_created_at_alter_user_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='verification_expires_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
