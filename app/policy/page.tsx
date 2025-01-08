import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | BuildersCabal',
  description: 'This Privacy Policy explains how BuildersCabal collects, uses, discloses, and protects your information when you access our platform.'
};

const PrivacyPolicy = () => {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-foreground">Privacy Policy for BuildersCabal</h1>
        <p className="text-muted-foreground">Effective Date: 26th October, 2024</p>

        <div className="space-y-8 mt-8">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">1. Introduction</h2>
            <p className="text-muted-foreground">
              This Privacy Policy explains how BuildersCabal collects, uses, discloses, and protects your information
              when you access our platform. We are committed to safeguarding your privacy and ensuring that your personal
              data is handled responsibly and in accordance with applicable laws.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">2. Information We Collect</h2>
            <p className="text-muted-foreground">We may collect the following types of personal information:</p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Names</li>
              <li>Email addresses</li>
              <li>IP addresses</li>
              <li>Account details and preferences</li>
              <li>Payment information</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">3. Purpose of Data Collection</h2>
            <p className="text-muted-foreground">We use your personal data for the following purposes:</p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>To provide and maintain our services.</li>
              <li>To communicate with you, including sending updates and promotional materials.</li>
              <li>To improve our platform and user experience.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">4. Legal Basis for Processing</h2>
            <p className="text-muted-foreground">We rely on the following legal bases for processing your personal data:</p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Your consent</li>
              <li>Contractual necessity</li>
              <li>Legal obligations</li>
              <li>Legitimate interests</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">5. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal data for as long as necessary to fulfill the purposes outlined in this Privacy
              Policy, or as required by law.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">6. User Rights</h2>
            <p className="text-muted-foreground">You have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>The right to access your data</li>
              <li>The right to rectify inaccurate data</li>
              <li>The right to erasure (the right to be forgotten)</li>
              <li>The right to restrict processing</li>
              <li>The right to data portability</li>
              <li>The right to object to processing</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">7. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal data against
              unauthorized access, loss, or theft.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">8. Data Transfers</h2>
            <p className="text-muted-foreground">
              If we transfer your personal data outside of Nigeria, we ensure that appropriate safeguards are in place to
              protect your data.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">9. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              policy on this page.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">10. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions or concerns regarding this Privacy Policy, please contact us at{" "}
              <Link href="mailto:support@builderscabal.com" className="text-blue-600 hover:underline">
                support@builderscabal.com
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;