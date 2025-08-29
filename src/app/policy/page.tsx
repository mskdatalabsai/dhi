"use client";

import React from "react";

const PolicyPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dhiti Policies
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Policy Content Container */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            {/* Business Policy Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Business Policy
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  At <strong>Dhiti.AI</strong>, we are committed to building
                  trust, transparency, and value for every user. Our business
                  policies are designed to ensure fairness, data security, and a
                  seamless user experience.
                </p>

                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>Transparency First</strong> – All pricing,
                    processes, and services are communicated clearly to avoid
                    hidden surprises.
                  </li>
                  <li>
                    <strong>User Data Privacy</strong> – We follow strict data
                    security standards; your responses and personal information
                    remain confidential and encrypted.
                  </li>
                  <li>
                    <strong>Fair Pricing</strong> – Simple and affordable
                    pricing (₹95 in India / $5 globally) to make career guidance
                    accessible to everyone.
                  </li>
                  <li>
                    <strong>Continuous Improvement</strong> – We evolve our
                    assessments, recommendations, and services regularly to stay
                    aligned with market needs and user feedback.
                  </li>
                  <li>
                    <strong>Ethical AI Practices</strong> – Our algorithms are
                    designed responsibly, keeping human judgment at the center
                    of every recommendation.
                  </li>
                </ul>

                <p className="text-purple-600 dark:text-purple-400 font-medium mt-6">
                  👉 Our policy ensures that{" "}
                  <strong>your trust drives our growth.</strong>
                </p>
              </div>
            </section>

            {/* Business Category Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Business Category
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  <strong>Dhiti.AI</strong> operates in the{" "}
                  <strong>EdTech and Career Guidance industry</strong>, blending
                  advanced technology with personal growth.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div className="space-y-3">
                    <div>
                      <strong className="text-gray-900 dark:text-white">
                        Industry:
                      </strong>
                      <p className="text-gray-700 dark:text-gray-300">
                        Education Technology (EdTech)
                      </p>
                    </div>
                    <div>
                      <strong className="text-gray-900 dark:text-white">
                        Focus Area:
                      </strong>
                      <p className="text-gray-700 dark:text-gray-300">
                        Career Assessment & Guidance for IT and Digital Roles
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <strong className="text-gray-900 dark:text-white">
                        Service Type:
                      </strong>
                      <p className="text-gray-700 dark:text-gray-300">
                        AI-powered career assessments, personalized learning
                        paths, and mentorship support
                      </p>
                    </div>
                    <div>
                      <strong className="text-gray-900 dark:text-white">
                        Global Reach:
                      </strong>
                      <p className="text-gray-700 dark:text-gray-300">
                        Affordable, accessible, and designed for individuals
                        worldwide
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <strong className="text-gray-900 dark:text-white">
                    Target Users:
                  </strong>
                  <ul className="mt-2 space-y-2 text-gray-700 dark:text-gray-300">
                    <li>🎓 Students & Graduates exploring IT careers</li>
                    <li>🔄 Career switchers transitioning into tech</li>
                    <li>
                      🚀 Professionals seeking upskilling or domain shifts
                    </li>
                  </ul>
                </div>

                <p className="text-purple-600 dark:text-purple-400 font-medium">
                  👉 We stand at the intersection of{" "}
                  <strong>
                    Education, Artificial Intelligence, and Career Development
                  </strong>{" "}
                  — helping people discover not just jobs, but
                  <strong> their true calling in IT.</strong>
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                For questions about our policies, please contact us through our
                <a
                  href="/contact"
                  className="text-purple-600 dark:text-purple-400 hover:underline ml-1"
                >
                  Contact page
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
