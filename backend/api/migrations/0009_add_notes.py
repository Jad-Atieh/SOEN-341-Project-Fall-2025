from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_add_target_user_to_auditlog'),  # replace with the last migration file
    ]

    operations = [
        migrations.AddField(
            model_name='auditlog',
            name='notes',
            field=models.TextField(blank=True, null=True),
        ),
    ]
