import os
from flask import Flask, request, jsonify
from flask_cors import CORS # Para permitir requisições do seu frontend
import smtplib # Para enviar e-mails
from email.mime.text import MIMEText # Para construir a mensagem de e-mail
from dotenv import load_dotenv # Para carregar variáveis de ambiente do arquivo .env

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

app = Flask(__name__)
CORS(app) # Habilita CORS para todas as rotas, permitindo que seu frontend acesse o backend

# --- Configurações de E-mail ---
# Busque estas configurações do seu arquivo .env
SMTP_SERVER = os.environ.get('SMTP_SERVER')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587)) # Porta padrão 587 para TLS
SMTP_USERNAME = os.environ.get('EMAIL_USER')
SMTP_PASSWORD = os.environ.get('EMAIL_PASSWORD')
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL') # E-mail que receberá as mensagens

@app.route('/send_message', methods=['POST'])
def send_message_route():
    data = request.get_json()

    sender_email_from_form = data.get('email')
    sender_phone_from_form = data.get('telefone')
    message_body_from_form = data.get('mensagem')

    # Validação básica dos dados recebidos
    if not sender_email_from_form or not message_body_from_form:
        return jsonify({'status': 'error', 'message': 'E-mail e mensagem são obrigatórios.'}), 400

    # Validação das configurações do servidor de e-mail
    if not SMTP_SERVER or not SMTP_USERNAME or not SMTP_PASSWORD or not RECIPIENT_EMAIL:
        app.logger.error("Erro de configuração: As variáveis de ambiente para envio de e-mail não estão completas.")
        return jsonify({'status': 'error', 'message': 'Erro interno no servidor ao configurar o envio de e-mail.'}), 500

    # Construção do corpo do e-mail
    email_subject = f"Nova Mensagem do Site de: {sender_email_from_form}"
    email_body = f"""
    Você recebeu uma nova mensagem através do formulário de contato do site:

    E-mail do Remetente: {sender_email_from_form}
    Telefone: {sender_phone_from_form if sender_phone_from_form else 'Não informado'}

    Mensagem:
    {message_body_from_form}
    """

    msg = MIMEText(email_body, 'plain', 'utf-8') # Especifica o charset para utf-8
    msg['Subject'] = email_subject
    msg['From'] = SMTP_USERNAME # O e-mail configurado no servidor como remetente
    msg['To'] = RECIPIENT_EMAIL

    try:
        app.logger.info(f"Tentando conectar a {SMTP_SERVER}:{SMTP_PORT}")
        # Adicionando um timeout de 10 segundos para a conexão inicial
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            app.logger.info("Conectado ao servidor SMTP. Tentando EHLO inicial.")
            server.ehlo() # Primeira saudação ao servidor
            app.logger.info("Tentando iniciar TLS (criptografia).")
            server.starttls()
            app.logger.info("TLS iniciado com sucesso. Tentando EHLO novamente após TLS.")
            server.ehlo() # Segunda saudação, agora sobre a conexão segura
            app.logger.info(f"Tentando login com o usuário: {SMTP_USERNAME}.")
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            app.logger.info("Login SMTP bem-sucedido. Enviando e-mail...")
            server.sendmail(SMTP_USERNAME, RECIPIENT_EMAIL, msg.as_string())
            app.logger.info(f"E-mail enviado com sucesso de {sender_email_from_form} para {RECIPIENT_EMAIL}")
        
        return jsonify({'status': 'success', 'message': 'Mensagem enviada com sucesso!'})

    except smtplib.SMTPConnectError as e_connect:
        app.logger.error(f"Erro de CONEXÃO SMTP: {e_connect}")
        return jsonify({'status': 'error', 'message': f'Não foi possível conectar ao servidor de e-mail: {e_connect}'}), 500
    except smtplib.SMTPHeloError as e_helo:
        app.logger.error(f"Erro de EHLO/HELO SMTP: {e_helo}")
        return jsonify({'status': 'error', 'message': f'Erro ao comunicar com o servidor de e-mail (EHLO): {e_helo}'}), 500
    except smtplib.SMTPAuthenticationError as e_auth:
        app.logger.error(f"Erro de AUTENTICAÇÃO SMTP: {e_auth}")
        return jsonify({'status': 'error', 'message': f'Erro de autenticação com o servidor de e-mail: {e_auth}'}), 500
    except smtplib.SMTPServerDisconnected as e_disconnect:
        app.logger.error(f"Servidor SMTP desconectou inesperadamente: {e_disconnect}")
        return jsonify({'status': 'error', 'message': f'O servidor de e-mail desconectou inesperadamente: {e_disconnect}'}), 500
    except smtplib.SMTPException as e_smtp:
        app.logger.error(f"Erro SMTP genérico: {type(e_smtp).__name__} - {e_smtp}")
        return jsonify({'status': 'error', 'message': f'Ocorreu um erro SMTP: {e_smtp}'}), 500
    except Exception as e: # Captura genérica para outros erros
        # Loga o tipo da exceção e a mensagem da exceção
        app.logger.error(f"Ocorreu um erro desconhecido ao enviar e-mail: {type(e).__name__} - {e}")
        return jsonify({'status': 'error', 'message': f'Ocorreu um erro ao enviar a mensagem: {str(e)}'}), 500

if __name__ == '__main__':
    # O host 0.0.0.0 torna o servidor acessível na sua rede local
    # A porta 5000 é a padrão do Flask.
    # debug=True é útil para desenvolvimento, pois reinicia o servidor automaticamente após alterações
    # e mostra mensagens de erro detalhadas no navegador. DESATIVE EM PRODUÇÃO.
    app.run(host='0.0.0.0', port=5000, debug=True)
