use blind_rsa_signatures::{
    BlindSignature, BlindedMessage, BlindingResult, DefaultRng, Error, KeyPair, MessageRandomizer,
    Options, PublicKey, SecretKey, Signature,
};

const RSA_KEY_BITS: usize = 2048;

/// A finalized blind signature and the randomizer required to verify it.
#[derive(Clone, Debug)]
pub struct VerifiedSignature {
    pub signature: Signature,
    pub message_randomizer: Option<MessageRandomizer>,
}

pub fn generate_keys() -> Result<(SecretKey, PublicKey), Error> {
    let mut rng = DefaultRng;
    let key_pair = KeyPair::generate(&mut rng, RSA_KEY_BITS)?;
    Ok((key_pair.sk, key_pair.pk))
}

pub fn blind_message(
    message: impl AsRef<[u8]>,
    public_key: &PublicKey,
) -> Result<BlindingResult, Error> {
    let mut rng = DefaultRng;
    public_key.blind(&mut rng, message, true, &Options::default())
}

pub fn sign_blinded_message(
    blinded_message: &BlindedMessage,
    private_key: &SecretKey,
) -> Result<BlindSignature, Error> {
    private_key.blind_sign(&mut DefaultRng, blinded_message, &Options::default())
}

pub fn unblind_signature(
    blinded_signature: &BlindSignature,
    blinding_result: &BlindingResult,
    message: impl AsRef<[u8]>,
    public_key: &PublicKey,
) -> Result<VerifiedSignature, Error> {
    let signature = public_key.finalize(
        blinded_signature,
        &blinding_result.secret,
        blinding_result.msg_randomizer,
        message,
        &Options::default(),
    )?;

    Ok(VerifiedSignature {
        signature,
        message_randomizer: blinding_result.msg_randomizer,
    })
}

pub fn verify_signature(
    message: impl AsRef<[u8]>,
    signature: &VerifiedSignature,
    public_key: &PublicKey,
) -> Result<bool, Error> {
    Ok(signature
        .signature
        .verify(
            public_key,
            signature.message_randomizer,
            message,
            &Options::default(),
        )
        .is_ok())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn blind_sign_unblind_and_verify() {
        let message = b"candidate-42";
        let (private_key, public_key) = generate_keys().expect("key generation should succeed");
        let blinding_result =
            blind_message(message, &public_key).expect("message blinding should succeed");
        let blinded_signature = sign_blinded_message(&blinding_result.blind_msg, &private_key)
            .expect("blind signing should succeed");
        let signature =
            unblind_signature(&blinded_signature, &blinding_result, message, &public_key)
                .expect("unblinding should succeed");

        assert!(
            verify_signature(message, &signature, &public_key)
                .expect("signature verification should complete")
        );
        assert!(
            !verify_signature(b"candidate-43", &signature, &public_key)
                .expect("signature verification should complete")
        );
    }
}
