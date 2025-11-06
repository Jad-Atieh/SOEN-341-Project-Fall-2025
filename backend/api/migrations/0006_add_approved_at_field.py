from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_add_approval_fields'),  # replace with the latest migration you have
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='approved_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
