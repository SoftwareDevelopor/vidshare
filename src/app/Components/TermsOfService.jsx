import React from 'react';

export default function TermsOfService() {
  const Section = ({ title, children }) => (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </div>
    </section>
  );

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-12 border-b border-gray-200 dark:border-gray-700 pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Effective date: March 15, 2026
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12">
            <Section title="1. Introduction">
              <p>
                Thank you for using our platform. These Terms of Service ("Terms") cover your use of and access to our products, services, software, platform and websites (collectively, "Services"). By using our Services, you agree to be bound by these Terms as well as our Privacy Policy.
              </p>
              <p>
                If you are using our Services as the employee or agent of an organization, you are agreeing to these Terms on behalf of that organization.
              </p>
            </Section>

            <Section title="2. Who May Use the Service?">
              <p>
                You must be at least 13 years old to use the Service. However, children of all ages may use the Service and YouTube Kids (where available) if enabled by a parent or legal guardian.
              </p>
              <p>
                If you are under 18, you represent that you have your parent or guardian's permission to use the Service. Please have them read this Agreement with you.
              </p>
            </Section>

            <Section title="3. Your Use of the Service">
              <p>
                Content on the Service includes videos, audio (for example music and other sounds), graphics, photos, text (such as comments and scripts), branding (including trade names, trademarks, service marks, or logos), interactive features, software, metrics, and other materials whether provided by you, us or a third-party (collectively, "Content").
              </p>
              <p>
                Content is the responsibility of the person or entity that provides it to the Service. We are under no obligation to host or serve Content. If you see any Content you believe does not comply with this Agreement, including by violating the Community Guidelines or the law, you can report it to us.
              </p>
            </Section>

            <Section title="4. Your Content and Conduct">
              <p>
                If you have a channel, you may be able to upload Content to the Service. You may use your Content to promote your business or artistic enterprise. If you choose to upload Content, you must not submit to the Service any Content that does not comply with this Agreement or the law.
              </p>
              <p>
                For example, the Content you submit must not include third-party intellectual property (such as copyrighted material) unless you have permission from that party or are otherwise legally entitled to do so.
              </p>
            </Section>

            <Section title="5. Account Suspension & Termination">
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">Terminations by You</h3>
              <p>
                You may stop using the Service at any time. Follow these instructions to delete the Service from your Account, which involves closing your channel and removing your data.
              </p>
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">Terminations and Suspensions by Us</h3>
              <p>
                We may suspend or terminate your access to all or part of the Service if (a) you materially or repeatedly breach this Agreement; (b) we are required to do so to comply with a legal requirement or a court order; or (c) we believe there has been conduct that creates (or could create) liability or harm to any user, other third party, us or our Affiliates.
              </p>
            </Section>

            <Section title="6. Warranty Disclaimer">
              <p className="uppercase text-sm tracking-wide font-medium">
                Other than as expressly stated in this agreement or as required by law, the service is provided “as is” and we do not make any specific commitments or warranties about the service. For example, we don’t make any warranties about: (a) the content provided through the service; (b) the specific features of the service, or its accuracy, reliability, availability, or ability to meet your needs; or (c) that any content you submit will be accessible on the service.
              </p>
            </Section>
          </div>
        </main>

        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 text-sm">
          <p>
            &copy; 2026 YouTube Clone. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
