import React from 'react';

export default function PrivacyPolicy() {
  const Section = ({ title, children }) => (
    <section className="mb-12">
      <h2 className="text-3xl font-bold border-b-2 border-red-600 pb-2 mb-6">
        {title}
      </h2>
      <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </section>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-red-600">
            Privacy Policy
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Last updated: March 10, 2026
          </p>
        </header>

        <main>
          <Section title="Welcome to Our Privacy Policy">
            <p>
              When you use our services, you’re trusting us with your information. We understand this is a big responsibility and work hard to protect your information and put you in control.
            </p>
            <p>
              This Privacy Policy is meant to help you understand what information we collect, why we collect it, and how you can update, manage, export, and delete your information.
            </p>
          </Section>

          <Section title="Information We Collect">
            <p>
              We collect information to provide better services to all our users — from figuring out basic stuff like which language you speak, to more complex things like which videos you might like. The information we collect, and how that information is used, depends on how you use our services and how you manage your privacy controls.
            </p>
            <h3 className="text-2xl font-semibold pt-4">Information you create or provide to us</h3>
            <p>
              When you create an account, you provide us with personal information that includes your name and a password. You can also choose to add a phone number or payment information to your account. Even if you aren’t signed in to an Account, you might choose to provide us with information — like an email address to receive updates about our services.
            </p>
            <h3 className="text-2xl font-semibold pt-4">Information we collect as you use our services</h3>
            <p>
              We collect information about the apps, browsers, and devices you use to access our services, which helps us provide features like automatic product updates. We also collect information about your activity in our services, which we use to do things like recommend a video you might like.
            </p>
          </Section>

          <Section title="Why We Collect Data">
            <p>
              We use the information we collect from all our services for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Provide our services:</strong> We use your information to deliver our services, like processing the terms you search for in order to return results.</li>
              <li><strong>Maintain & improve our services:</strong> We also use your information to ensure our services are working as intended, such as tracking outages or troubleshooting issues that you report to us.</li>
              <li><strong>Develop new services:</strong> We use the information we collect in existing services to help us develop new ones.</li>
              <li><strong>Provide personalized services, including content and ads:</strong> We use the information we collect to customize our services for you, including providing recommendations, personalized content, and customized search results.</li>
              <li><strong>Measure performance:</strong> We use data for analytics and measurement to understand how our services are used.</li>
            </ul>
          </Section>

          <Section title="Sharing Your Information">
            <p>
              We do not share your personal information with companies, organizations, or individuals outside of our company except in the following cases:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>With your consent:</strong> We’ll share personal information outside of our company when we have your consent.</li>
              <li><strong>For external processing:</strong> We provide personal information to our affiliates and other trusted businesses or persons to process it for us, based on our instructions and in compliance with our Privacy Policy and any other appropriate confidentiality and security measures.</li>
              <li><strong>For legal reasons:</strong> We will share personal information if we have a good-faith belief that access, use, preservation, or disclosure of the information is reasonably necessary to meet any applicable law, regulation, legal process, or enforceable governmental request.</li>
            </ul>
          </Section>

          <Section title="Your Privacy Controls">
            <p>
              You have choices regarding the information we collect and how it's used. This section describes key controls for managing your privacy across our services.
            </p>
            <p>
              You can visit your account settings to review and manage your privacy settings. You can also manage your preferences about the ads shown to you on our services and on sites and apps that partner with us.
            </p>
          </Section>

          <Section title="Contact Us">
            <p>
              If you have any questions about this Privacy Policy, you can contact us. We are committed to protecting your privacy and ensuring you have a positive experience on our platform.
            </p>
            <p>
              You can reach out to our support team through the help section of our application or by emailing us at <a href="mailto:privacy@example.com" className="text-red-500 hover:underline">privacy@example.com</a>.
            </p>
          </Section>
        </main>
      </div>
    </div>
  );
}
