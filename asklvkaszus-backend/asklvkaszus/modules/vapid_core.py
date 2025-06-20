import ecdsa
import base64
from ..extensions import sql
from ..models.push_notifications_keys import PushNotificationsKeys
from ..models.push_notifications_subscribers import PushNotificationsSubscribers
from flask import current_app


# TODO! More secure implementation (IDEA):
# - Memory safety: Destruction of ECDSA keys after generation
# - Proper key validation: Checking validity before saving
# - Better error handling: Full logging, safe error responses
# - Cleaning resources: Session closing
# - Maybe (?) storing ECDSA keys in encrypted form - I must think how! :)
# TODO! Comments in the code as in other files.


# Ask @lvkaszus! - VAPID Core for Web Push Notifications System:

def generate_vapid_keys():
    # https://gist.github.com/cjies/cc014d55976db80f610cd94ccb2ab21e
    try:        
        pk = ecdsa.SigningKey.generate(curve=ecdsa.NIST256p)
        vk = pk.get_verifying_key()

        private_key = base64.urlsafe_b64encode(pk.to_string()).rstrip(b"=").decode('utf-8')
        public_key = base64.urlsafe_b64encode(b"\x04" + vk.to_string()).rstrip(b"=").decode('utf-8')

        return private_key, public_key

    except Exception as e:
        current_app.logger.exception("Unhandled Exception in VAPID Core (generate_vapid_keys)!")

        return {"error": "An error occurred while generating VAPID Keys!"}


def check_vapid_keys():
    existing_vapid_keys = PushNotificationsKeys.query.first()

    if not existing_vapid_keys:
        current_app.logger.warning("VAPID Keypair Database Entry not found! Creating new Database Entry with default settings...")

        result = generate_vapid_keys()
        if "error" in result:
            return {"error": result["error"]}

        private_key, public_key = result

        new_keys = PushNotificationsKeys(
            private_key=private_key,
            public_key=public_key    
        )

        sql.session.add(new_keys)
        sql.session.commit()

        current_app.logger.info("VAPID Keypair Database Entry has been created with default settings.")
        return {"success": "VAPID Keypair Database Entry created with default settings."}

    else:
        if existing_vapid_keys:
            if not existing_vapid_keys.public_key or not existing_vapid_keys.private_key:
                current_app.logger.warning("VAPID Keypair exists, but one or both keys are missing! Regenerating new VAPID Keypair and clearing subscribers...")

                result = generate_vapid_keys()
                if "error" in result:
                    return {"error": result["error"]}

                private_key, public_key = result

                existing_vapid_keys.public_key = public_key
                existing_vapid_keys.private_key = private_key

                PushNotificationsSubscribers.query.delete()
                sql.session.commit()

                current_app.logger.info("VAPID Keypair has been regenerated and subscribers table cleared.")

                return {"success": "VAPID Keypair has been regenerated and subscribers table cleared."}

            else:
                current_app.logger.info("Push notifications are enabled with existing VAPID Keypair!")

                return {"success": "Push notifications are enabled with existing VAPID Keypair!"}
        else:
            current_app.logger.info("Push notifications are disabled - option 'enabled' is set to False.")

            return {"success": "Push notifications are disabled."}
