"use client";
import { Mail, Phone, Clock, MapPin, Stethoscope } from "lucide-react";
import { useTranslations } from "next-intl";
import { useClinicInformation } from "@/hooks/useClinicInformation";
import { Link } from "@/i18n/navigation";

const Footer = () => {
  const t = useTranslations("landingPage.footer");
  const { data } = useClinicInformation();

  const clinic = data?.body?.clinic;
  const contact = data?.body?.contact;

  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-400 mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Stethoscope className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-xl font-bold">{clinic?.name}</h3>
                <p className="text-sm text-gray-400">{clinic?.description}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">{clinic?.about}</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">{t("contact")}</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  {contact?.address ?? t("fallbackAddress")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">
                  {t("hotline")}: {contact?.hotline}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">{contact?.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-gray-400">
                  <div>
                    {t("mondayToSaturday")}: {contact?.workingHours?.mondayToSaturday}
                  </div>
                  <div>
                    {t("sunday")}: {contact?.workingHours?.sunday}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">{t("quickLinks")}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  {t("links.about")}
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-gray-400 hover:text-white transition">
                  {t("links.doctors")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition">
                  {t("links.services")}
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white transition">
                  {t("links.news")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  {t("links.privacy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  {t("links.terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h4 className="font-bold text-lg mb-6">{t("map")}</h4>
            <div className="bg-gray-800 rounded-lg h-48 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>{t("copyright", { year: new Date().getFullYear(), clinicName: clinic?.name ?? "" })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
