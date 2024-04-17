import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { moderateScale } from "../utils/Scaling";

const Privacy = () => {
  return (
    <View>
      <Text style={styles.bodyText}>
        Autobg.ai recognises the importance of maintaining your privacy. We
        value your privacy and appreciate your trust in us. This Policy
        describes how we treat user information we collect on
        http://www.autobg.ai and other offline sources. This Privacy Policy
        applies to current and former visitors to our website and to our online
        customers. By visiting and/or using our website, you agree to this
        Privacy Policy.
        {"\n"}
        {"\n"}
        Autobg.ai is a property of Autobg LLC, an Indian Company registered
        under the Companies Act, 2013 having its registered office at New Delhi,
        India.
      </Text>
      <Text style={styles.titleText}>Information we collect</Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>Contact information.</Text> We might
        collect your name, email, mobile number, phone number, street, city,
        state, pincode, country and ip address.
        {"\n"}
        {"\n"}
        <Text style={styles.boldText}>Payment and billing information.</Text> We
        might collect your billing name, billing address and payment method when
        you buy a ticket. We NEVER collect your credit card number or credit
        card expiry date or other details pertaining to your credit card on our
        website. Credit card information will be obtained and processed by our
        online payment partner Stripe.
        {"\n"}
        {"\n"}
        <Text style={styles.boldText}>Demographic information.</Text> We may
        collect demographic information about you, events you like, events you
        intend to participate in, tickets you buy, or any other information
        provided by your during the use of our website. We might collect this as
        a part of a survey also.
        {"\n"}
        {"\n"}
        <Text style={styles.boldText}>Other information.</Text> If you use our
        website, we may collect information about your IP address and the
        browser you're using. We might look at what site you came from, duration
        of time spent on our website, pages accessed or what site you visit when
        you leave us. We might also collect the type of mobile device you are
        using, or the version of the operating system your computer or device is
        running.
      </Text>
      <Text style={styles.titleText}>
        We collect information in different ways
      </Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>
          We collect information directly from you.
        </Text>{" "}
        We collect information directly from you when you register for an event
        or buy tickets. We also collect information if you post a comment on our
        websites or ask us a question through phone or email.
        {"\n"}
        {"\n"}
        <Text style={styles.boldText}>
          We collect information from you passively.
        </Text>{" "}
        We use tracking tools like Google Analytics, Google Webmaster, browser
        cookies and web beacons for collecting information about your usage of
        our website.
      </Text>
      <Text style={styles.titleText}>Use of your personal information</Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>We use information to contact you:</Text>{" "}
        We might use the information you provide to contact you for confirmation
        of a purchase on our website or for other promotional purposes.
        {"\n"}
        {"\n"}
        <Text style={styles.boldText}>
          We use information to respond to your requests or questions.
        </Text>{" "}
        We might use your information to confirm your registration for an event
        or contest.
        {"\n"}
        {"\n"}
        <Text style={styles.boldText}>
          We use information to improve our products and services.
        </Text>{" "}
        We might use your information to customize your experience with us. This
        could include displaying content based upon your preferences.
        {"\n"}
        {"\n"}
        <Text style={styles.boldText}>
          We use information to look at site trends and customer interests.
        </Text>{" "}
        We may use your information to make our website and products better. We
        may combine information we get from you with information about you we
        get from third parties.
        {"\n"}
        {"\n"}
        <Text style={styles.boldText}>
          We use information for security purposes.
        </Text>{" "}
        We may use information to protect our company, our customers, or our
        websites.
        {"\n"}
        {"\n"}
        <Text style={styles.boldText}>
          We use information for marketing purposes.
        </Text>{" "}
        We might send you information about special promotions or offers. We
        might also tell you about new features or products. These might be our
        own offers or products, or third-party offers or products we think you
        might find interesting. Or, for example, if you buy tickets from us,
        we'll enrol you in our newsletter.
        {"\n"}
        {"\n"}
        <Text style={styles.boldText}>
          We use information to send you transactional communications.
        </Text>{" "}
        We might send you emails or SMS about your account or a ticket purchase.
        We use information as otherwise permitted by law.
      </Text>
      <Text style={styles.titleText}>
        Sharing of information with third parties
      </Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>
          We may share information if we think we must comply with the law or to
          protect ourselves.
        </Text>{" "}
        We will share information to respond to a court order or subpoena. We
        may also share it if a government agency or investigatory body requests.
        Or we might also share information when we are investigating potential
        fraud.
        {"\n"}
        {"\n"}
        <Text style={styles.boldText}>
          We may share information with any successor to all or part of our
          business.
        </Text>{" "}
        For example, if part of our business is sold, we may give our customer
        list as part of that transaction.
      </Text>
      <Text style={styles.titleText}>Email Opt-Out</Text>
      <Text style={styles.bodyText}>
        <Text style={styles.boldText}>
          You can opt out of receiving our marketing emails.
        </Text>{" "}
        To stop receiving our promotional emails, please email
        unsubscribe@autobg.ai. It may take about seven days to process your
        request. Even if you opt out of getting marketing messages, we will
        still be sending you transactional messages through email and SMS about
        your purchases.
      </Text>
      <Text style={styles.titleText}>Third party sites</Text>
      <Text style={styles.bodyText}>
        If you click on one of the links to third party websites, you may be
        taken to websites we do not control. This policy does not apply to the
        privacy practices of those websites. Read the privacy policy of other
        websites carefully. We are not responsible for these third-party sites.
      </Text>
      <Text style={styles.titleText}>Grievance Officer</Text>
      <Text style={styles.bodyText}>
        In accordance with Information Technology Act 2000 and rules made there
        under, the name and contact details of the Grievance Officer are
        provided below:
        {"\n"}
        {"\n"}
        Grievance Officer - Mr Sunil K reachable at grievance@autobg.ai
        {"\n"}
        {"\n"}
        If you have any questions about this Policy or other privacy concerns,
        you can also email us at support@autobg.ai
      </Text>
      <Text style={styles.titleText}>Updates to this policy</Text>
      <Text style={styles.bodyText}>
        This Privacy Policy was last updated on 04.12.2023. From time to time we
        may change our privacy practices. We will notify you of any material
        changes to this policy as required by law. We will also post an updated
        copy on our website. Please check our site periodically for updates.
      </Text>
      <Text style={styles.titleText}>Refund Policy</Text>
      <Text style={styles.bodyText}>
        As per company policy, there is no refund or moneyback through your
        original payment method. The customer would get credits back as refund
        if results are not upto expectation. Once you purchase a subscription,
        you cannot get a refund for any unused portion of the subscription
        period.
      </Text>
      <Text style={styles.titleText}>Jurisdiction</Text>
      <Text style={styles.bodyText}>
        If you choose to visit the website, your visit and any dispute over
        privacy is subject to this Policy and the website's terms of use. In
        addition to the foregoing, any disputes arising under this Policy shall
        be governed by the laws of India.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    color: "#2492FE",
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginVertical: 20,
  },
  bodyText: {
    color: "#9D9D9D",
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  boldText: {
    fontWeight: "bold",
    color: "#000",
  },
});

export default Privacy;
