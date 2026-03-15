# Arquivo para controlar o banco de dados no ambiente de produção Render (versão grátis não tem CMD)

import os
import subprocess
from django.core.management.base import BaseCommand
from django.db import connection, transaction
from django.conf import settings

class Command(BaseCommand):
    help = 'Gerenciamento remoto do DB no Render (Backup, Restore, Drop, Reset)'

    def add_arguments(self, parser):
        parser.add_argument('action', type=str, help='drop, backup, restore, reset')
        parser.add_argument('--file', type=str, help='Caminho do arquivo .sql')

    def handle(self, *args, **options):
        action = options['action']
        db_conf = settings.DATABASES['default']
        
        # URL de conexão para ferramentas externas (pg_dump/psql)
        db_url = f"postgresql://{db_conf['USER']}:{db_conf['PASSWORD']}@{db_conf['HOST']}:{db_conf['PORT']}/{db_conf['NAME']}"

        if action == 'drop':
            self.drop_all_tables()
        
        elif action == 'backup':
            self.run_shell(f"pg_dump {db_url} > backup.sql")
            self.stdout.write(self.style.SUCCESS("Backup criado: backup.sql"))

        elif action == 'restore':
            file_path = options.get('file') or 'backup.sql'
            self.run_shell(f"psql {db_url} < {file_path}")
            self.stdout.write(self.style.SUCCESS(f"Restore finalizado usando {file_path}"))

        elif action == 'reset':
            # Dropa tudo, recria via migrations e carrega dados de um arquivo
            self.drop_all_tables()
            self.run_shell("python manage.py migrate")
            if options.get('file'):
                self.run_shell(f"psql {db_url} < {options['file']}")
            self.stdout.write(self.style.SUCCESS("Banco resetado e atualizado."))

    def drop_all_tables(self):
        self.stdout.write("Limpando banco de dados...")
        with connection.cursor() as cursor:
            cursor.execute("""
                DO $$ DECLARE
                    r RECORD;
                BEGIN
                    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
                    END LOOP;
                END $$;
            """)
        self.stdout.write(self.style.WARNING("Todas as tabelas foram removidas."))

    def run_shell(self, command):
        try:
            subprocess.run(command, shell=True, check=True)
        except subprocess.CalledProcessError as e:
            self.stdout.write(self.style.ERROR(f"Erro ao executar comando: {e}"))