import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export function generateKeys() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    const dir = './src/utils/generatedKeys';

    // Vérifier si le dossier existe, sinon le créer
    if (!fs.existsSync(dir)) {
        console.log(`Directory ${dir} does not exist. Creating...`);
        fs.mkdirSync(dir);
    } else {
        console.log(`Directory ${dir} already exists.`);
    }

    // Écrire la clé privée dans un fichier
    const privateKeyPath = path.join(dir, 'private.pem');
    fs.writeFileSync(privateKeyPath, privateKey);
    console.log(`Private key written to ${privateKeyPath}`);

    // Écrire la clé publique dans un fichier
    const publicKeyPath = path.join(dir, 'public.pem');
    fs.writeFileSync(publicKeyPath, publicKey);
    console.log(`Public key written to ${publicKeyPath}`);
}