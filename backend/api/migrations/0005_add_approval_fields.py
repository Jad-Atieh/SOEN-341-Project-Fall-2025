from django.db import migrations, models
from django.conf import settings

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_merge_20251106_1629'),  # your latest migration before this one
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='approved_by',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=models.SET_NULL,
                related_name='approved_events',
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
