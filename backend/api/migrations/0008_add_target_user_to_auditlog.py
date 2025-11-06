# Generated manually to add target_user field to AuditLog
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_create_auditlog_table'),  # replace with the last migration file
    ]

    operations = [
        migrations.AddField(
            model_name='auditlog',
            name='target_user',
            field=models.ForeignKey(
                to='api.User',
                null=True,
                blank=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='auditlogs'
            ),
        ),
    ]
