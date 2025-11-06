from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),  # replace with the last migration of api
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
    ]
