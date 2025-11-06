from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_add_approved_at_field'),  # replace with your last migration number
    ]

    operations = [
        migrations.CreateModel(
            name='AuditLog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(max_length=50)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('admin', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('target_event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.event')),
            ],
        ),
    ]
