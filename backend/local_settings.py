from .settings import *

DATABASES = {
    'default': {
        'ENGINE': 'mysql.connector.django',
        'NAME': 'soen341',
        'USER': 'thanusan11',
        'PASSWORD': 'Soen341team1',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}

DEBUG = True
