import ecdsa
import base64
from ..extensions import sql
from ..models.notifications_vapid_keys import NotificationsVapidKeys
from flask import current_app

def generate_vapid_keys():
    try:        
        pk = ecdsa.SigningKey.generate(curve=ecdsa.NIST256p)
        vk = pk.get_verifying_key()

        private_key = base64.urlsafe_b64encode(pk.to_string()).rstrip(b"=").decode('utf-8')
        public_key = base64.urlsafe_b64encode(b"\x04" + vk.to_string()).rstrip(b"=").decode('utf-8')

        return private_key, public_key
    except Exception as e:
        current_app.logger.error(f"An error occurred inside asklvkaszus/modules/vapid_core module - function generate_vapid_keys(): {e}")

        return {"error": "An error occurred while generating VAPID Keys!"}


def check_vapid_keys():
    try:
        existing_vapid_keys = NotificationsVapidKeys.query.first()

        if not existing_vapid_keys:
            current_app.logger.warning("VAPID Keypair not found! Generating new VAPID Keypair...")

            result = generate_vapid_keys()
            if "error" in result:
                return {"error": result["error"]}

            private_key, public_key = result

            new_keys = NotificationsVapidKeys(public_key=public_key, private_key=private_key)

            sql.session.add(new_keys)
            sql.session.commit()

            current_app.logger.warning("VAPID Keypair has been generated successfully.")

        else:
            if not existing_vapid_keys.public_key or not existing_vapid_keys.private_key:
                current_app.logger.warning("VAPID Keypair exists, but one or both keys are missing! Generating new VAPID Keypair...")

                result = generate_vapid_keys()
                if "error" in result:
                    return {"error": result["error"]}

                private_key, public_key = result

                existing_vapid_keys.public_key = public_key
                existing_vapid_keys.private_key = private_key

                sql.session.commit()

                current_app.logger.warning("VAPID Keypair has been updated successfully.")
            else:
                current_app.logger.info("Using existing VAPID Keypair from the application database!")
    except Exception as e:
        current_app.logger.error(f"An error occurred inside asklvkaszus/modules/vapid_core module - function check_vapid_keys(): {e}")

        return {"error": "An error occurred while checking VAPID Keys!"}

    finally:
        sql.session.close()