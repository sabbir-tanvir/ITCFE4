import { useEffect, useState, useRef } from "react";
import { Api_Base_Url, Site_Id } from "../config/api";
import { fetchSiteSettings } from "../config/siteSettingsApi";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AdmissionForm = () => {
  // Removed inline result text; using toast notifications instead
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonColor, setButtonColor] = useState('#FC5D43');
  const location = useLocation();
  const [, setSelectedCourse] = useState(location.state?.course?.title || "");
  const preselectedCourse = location.state?.course?.title || "";
  const [primaryColor, setPrimaryColor] = useState('#FFFFFF');
  // Track select and date values for dynamic bg color
  const [selectValues, setSelectValues] = useState({
    course: '',
    gender: '',
    occupation: '',
    course_mode: '',
    date_of_birth: '',
    application_date: ''
  });


  // Fetch button color from site settings
  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data && data.button_color) {
          setButtonColor(data.button_color);
        }
      })
      .catch(() => { });
  }, []);

  // Fetch Primary color from site settings
  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data && data.primary_color) {
          setPrimaryColor(data.primary_color);
        }
      })
      .catch(() => { });
  }, []);



  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "নাম প্রয়োজন";
        if (value.trim().length < 2) return "নাম কমপক্ষে ২ অক্ষর হতে হবে";
        if (!/^[a-zA-Z\u0980-\u09FF\s]+$/.test(value.trim()))
          return "নামে শুধুমাত্র অক্ষর ব্যবহার করুন";
        return "";
      case "father_husband_name":
        if (!value.trim()) return "বাবার / স্বামীর নাম প্রয়োজন";
        if (value.trim().length < 2) return "নাম কমপক্ষে ২ অক্ষর হতে হবে";
        if (!/^[a-zA-Z\u0980-\u09FF\s]+$/.test(value.trim()))
          return "নামে শুধুমাত্র অক্ষর ব্যবহার করুন";
        return "";
      case "mobile":
        if (!value.trim()) return "মোবাইল নম্বর প্রয়োজন";
        if (!/^(\+88|88)?(01[3-9]\d{8})$/.test(value.trim()))
          return "সঠিক মোবাইল নম্বর দিন (১১ ডিজিট)";
        return "";
      case "course":
        if (!value) return "কোর্স নির্বাচন করুন";
        return "";
      default:
        return "";
    }
  };

  const validateForm = (formData) => {
    const requiredKeys = ["name", "father_husband_name", "mobile", "course"];
    const newErrors = {};
    let isValid = true;
    requiredKeys.forEach(key => {
      const value = formData.get(key) || "";
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${Api_Base_Url}/courses/?page_size=100`, {
          headers: {
            "Site-Id": Site_Id,
          },
        });
        const data = await response.json();
        setCourses(data.results || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const submitToastId = useRef(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    const rawForm = new FormData(event.target);

    // Add current date if not provided
    if (!rawForm.get("application_date")) {
      rawForm.set("application_date", new Date().toISOString().split("T")[0]);
    }
    rawForm.set("site_id", Site_Id);

    // Validate form
    if (!validateForm(rawForm)) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) toast.error(errors[firstErrorKey], { autoClose: 4000 });
      else toast.error('দয়া করে উপরের ভুলগুলো ঠিক করুন');
      return;
    }

    setIsSubmitting(true);

    // Show loading toast
    submitToastId.current = toast.loading('সাবমিট হচ্ছে...');

    // Build FormData with backend field names, ONLY append optional fields if they have a value
    const formData = new FormData();
    const parsedSiteId = Site_Id ? parseInt(Site_Id) : undefined;
    if (parsedSiteId) formData.append("site_id", parsedSiteId);

    // Required fields
    formData.append("name", rawForm.get("name"));
    formData.append("father_name", rawForm.get("father_husband_name"));
    formData.append("mobile", rawForm.get("mobile"));
    formData.append("guardian_mobile", rawForm.get("guardian_mobile"));
    if (rawForm.get("course")) formData.append("courses", parseInt(rawForm.get("course")));

    // Helper to conditionally append
    const appendIfValue = (key, value) => {
      if (value && value !== 'null') formData.append(key, value);
    };

    appendIfValue("mother_name", rawForm.get("mother_name"));
    appendIfValue("gender", rawForm.get("gender"));
    appendIfValue("date_of_birth", rawForm.get("date_of_birth"));
    appendIfValue("occupation", rawForm.get("occupation"));
    appendIfValue("course_mode", rawForm.get("course_mode"));
    appendIfValue("education_qualification", rawForm.get("education"));
    appendIfValue("email", rawForm.get("email"));
    appendIfValue("present_address", rawForm.get("current_address"));
    appendIfValue("permanent_address", rawForm.get("permanent_address"));
    appendIfValue("date_of_application", rawForm.get("application_date")); // fixed typo (was data_of_application)

    // Image as file (only if provided)
    const photoFile = rawForm.get("photo");
    if (photoFile && photoFile.name) {
      formData.append("student_img", photoFile);
    }

    // Debug log
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ':', pair[1]);
    // }
    // console.log("API URL:", `${Api_Base_Url}/students/`);
    // console.log("Site ID:", Site_Id);

    try {
      const response = await fetch(`${Api_Base_Url}/students/`, {
        method: "POST",
        headers: {
          "Site-Id": Site_Id,
        },
        body: formData,
      });

      console.log("Response status:", response.status);
      const resultData = await response.json();
      console.log("Response data:", resultData);

      if (response.ok) {
        if (resultData.results && resultData.results.length > 0) {
          toast.update(submitToastId.current, { render: 'সফলভাবে সাবমিট হয়েছে!', type: 'success', isLoading: false, autoClose: 4000 });
          event.target.reset();
          setErrors({});
          setSelectValues({
            course: '',
            gender: '',
            occupation: '',
            course_mode: '',
            date_of_birth: '',
            application_date: ''
          });
          setSelectedCourse("");
        } else if (resultData.message) {
          // result message shown via toast
          toast.update(submitToastId.current, { render: resultData.message, type: 'success', isLoading: false, autoClose: 4000 });
        } else {
          // result message shown via toast
          toast.update(submitToastId.current, { render: 'সফলভাবে সাবমিট হয়েছে!', type: 'success', isLoading: false, autoClose: 4000 });
          event.target.reset();
          setErrors({});
          setSelectValues({
            course: '',
            gender: '',
            occupation: '',
            course_mode: '',
            date_of_birth: '',
            application_date: ''
          });
          setSelectedCourse("");
        }
      } else {
        const errMsg = resultData.message || resultData.error || `Submission failed (${response.status})`;
        if (submitToastId.current) {
          toast.update(submitToastId.current, { render: errMsg, type: 'error', isLoading: false, autoClose: 5000 });
        } else {
          toast.error(errMsg);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
  const errMsg = "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন.";
      if (submitToastId.current) {
        toast.update(submitToastId.current, { render: errMsg, type: 'error', isLoading: false, autoClose: 5000 });
      } else {
        toast.error(errMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-[1440px] mx-auto p-6 mt-[40px] mb-[80px] bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 font-['Hind_Siliguri']">
          এডমিশন ফর্ম
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full"></div>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
  <ToastContainer position="top-center" newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />

        {/* Row 1: 3 items equally divided */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group">
            <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
              কোর্স <span className="text-red-500">*</span>
            </label>
            <select
              id="course"
              name="course"
              required
              value={preselectedCourse ? courses.find(c => c.title === preselectedCourse)?.id || selectValues.course : selectValues.course}
              className={`w-full p-3 border ${errors.course ? "border-red-500" : "border-[#FC5D43]"} rounded 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300 font-['Hind_Siliguri'] 
                ${errors.course ? "border-red-500" : "border-teal-700"}
                ${preselectedCourse ? "opacity-90" : ""}
              `}
              style={{ backgroundColor: (preselectedCourse || selectValues.course) ? '#E6F0FF' : `${primaryColor}4D`, appearance: 'none' }}
              onChange={e => {
                setSelectedCourse(e.target.value);
                setSelectValues(v => ({ ...v, course: e.target.value }));
              }}
              disabled={!!preselectedCourse}
            >
              <option value="">Select Course</option>
              {loading ? (
                <option value="" disabled>
                  Loading courses...
                </option>
              ) : (
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))
              )}
            </select>
            {/* Hidden input for course id when preselected and select is disabled */}
            {preselectedCourse && (
              <input type="hidden" name="course" value={courses.find(c => c.title === preselectedCourse)?.id || ""} />
            )}
            <div className="absolute right-3 top-12 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {errors.course && (
              <div className="text-red-500 text-xs mt-1  ">
                {errors.course}
              </div>
            )}
          </div>

          <div className="relative group">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
              নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="আপনার পূর্ণ নাম লিখুন"
              className={`w-full p-3 border ${errors.name ? "border-red-500" : "border-[#FC5D43]"} rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 font-['Hind_Siliguri']`}
              style={{ backgroundColor: selectValues.name && selectValues.name.trim() ? '#E6F0FF' : `${primaryColor}4D` }}
              value={selectValues.name || ''}
              onChange={e => setSelectValues(v => ({ ...v, name: e.target.value }))}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 font-['Hind_Siliguri']">{errors.name}</p>
            )}
          </div>

          <div className="relative group">
            <label
              htmlFor="father_husband_name"
              className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']"
            >
              বাবার / স্বামীর নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="father_husband_name"
              name="father_husband_name"
              required
              placeholder="বাবার বা স্বামীর নাম"
              className={`w-full p-3 border ${errors.father_husband_name ? "border-red-500" : "border-[#FC5D43]"} rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 font-['Hind_Siliguri']`}
              style={{ backgroundColor: selectValues.father_husband_name && selectValues.father_husband_name.trim() ? '#E6F0FF' : `${primaryColor}4D` }}
              value={selectValues.father_husband_name || ''}
              onChange={e => setSelectValues(v => ({ ...v, father_husband_name: e.target.value }))}
            />
            {errors.father_husband_name && (
              <p className="mt-1 text-sm text-red-600 font-['Hind_Siliguri']">{errors.father_husband_name}</p>
            )}
          </div>
        </div>

        {/* Row 2: 5 items - first 2 take half, next 3 take other half */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First half - 2 items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative group">
              <label htmlFor="mother_name" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
                মায়ের নাম
              </label>
              <input
                type="text"
                id="mother_name"
                name="mother_name"
                placeholder="মায়ের নাম"
                className="w-full p-3 border border-[#FC5D43] rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 font-['Hind_Siliguri']"
                style={{ backgroundColor: selectValues.mother_name && selectValues.mother_name.trim() ? '#E6F0FF' : `${primaryColor}4D` }}
                value={selectValues.mother_name || ''}
                onChange={e => setSelectValues(v => ({ ...v, mother_name: e.target.value }))}
              />
            </div>

            <div className="relative group">
              <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
                লিঙ্গ
              </label>
              <select
                id="gender"
                name="gender"
                className="w-full p-3 border border-[#FC5D43] rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300 font-['Hind_Siliguri']"
                style={{ backgroundColor: selectValues.gender ? '#E6F0FF' : `${primaryColor}4D`, appearance: 'none' }}
                value={selectValues.gender || ''}
                onChange={e => setSelectValues(v => ({ ...v, gender: e.target.value }))}
              >
                <option value="">লিঙ্গ নির্বাচন করুন</option>
                <option value="male">পুরুষ</option>
                <option value="female">মহিলা</option>
                <option value="other">অন্যান্য</option>
              </select>
              <div className="absolute right-3 top-12 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Second half - 3 items equally divided */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="relative group">
              <label
                htmlFor="date_of_birth"
                className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']"
              >
                জন্ম তারিখ
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                className="w-full p-3 border border-[#FC5D43] rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 font-['Hind_Siliguri']"
                style={{ backgroundColor: selectValues.date_of_birth ? '#E6F0FF' : `${primaryColor}4D` }}
                value={selectValues.date_of_birth || ''}
                onChange={e => setSelectValues(v => ({ ...v, date_of_birth: e.target.value }))}
              />
            </div>

            <div className="relative group">
              <label htmlFor="occupation" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
                পেশা
              </label>
              <select
                id="occupation"
                name="occupation"
                className="w-full p-3 border border-[#FC5D43] rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300 font-['Hind_Siliguri']"
                style={{ backgroundColor: selectValues.occupation ? '#E6F0FF' : `${primaryColor}4D`, appearance: 'none' }}
                value={selectValues.occupation || ''}
                onChange={e => setSelectValues(v => ({ ...v, occupation: e.target.value }))}
              >
                <option value="">পেশা নির্বাচন করুন</option>
                <option value="student">ছাত্র/ছাত্রী</option>
                <option value="job-holder">চাকরিজীবী</option>
                <option value="business">ব্যবসা</option>
                <option value="housewife">গৃহিণী</option>
                <option value="freelancer">ফ্রিল্যান্সার</option>
                <option value="unemployed">বেকার</option>
                <option value="other">অন্যান্য</option>
              </select>
              <div className="absolute right-3 top-12 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative group">
              <label htmlFor="course_mode" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
                কোর্স মোড
              </label>
              <select
                id="course_mode"
                name="course_mode"
                className="w-full p-3 border border-[#FC5D43] rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300 font-['Hind_Siliguri']"
                style={{ backgroundColor: selectValues.course_mode ? '#E6F0FF' : `${primaryColor}4D`, appearance: 'none' }}
                value={selectValues.course_mode || ''}
                onChange={e => setSelectValues(v => ({ ...v, course_mode: e.target.value }))}
              >
                <option value="">কোর্স মোড নির্বাচন করুন</option>
                <option value="online">অনলাইন</option>
                <option value="offline">অফলাইন</option>
              </select>
              <div className="absolute right-3 top-12 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: 4 items - 1st and 4th take 2 parts each, 2nd and 3rd take 2 parts together */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 relative group">
            <label htmlFor="education" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
              সর্বোচ্চ শিক্ষাগত যোগ্যতা
            </label>
            <input
              type="text"
              id="education"
              name="education"
              placeholder="যেমন: এইচএসসি, জিপিএ ৪.৫"
              className="w-full p-3 border border-[#FC5D43] rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 font-['Hind_Siliguri']"
              style={{ backgroundColor: selectValues.education && selectValues.education.trim() ? '#E6F0FF' : `${primaryColor}4D` }}
              value={selectValues.education || ''}
              onChange={e => setSelectValues(v => ({ ...v, education: e.target.value }))}
            />
          </div>

          <div className="col-span-12 md:col-span-3 relative group">
            <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
              মোবাইল <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              required
              placeholder="01XXXXXXXXX"
              className={`w-full p-3 border ${errors.mobile ? "border-red-500" : "border-[#FC5D43]"} rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 font-['Hind_Siliguri']`}
              style={{ backgroundColor: selectValues.mobile && selectValues.mobile.trim() ? '#E6F0FF' : `${primaryColor}4D` }}
              value={selectValues.mobile || ''}
              onChange={e => setSelectValues(v => ({ ...v, mobile: e.target.value }))}
            />
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-600 font-['Hind_Siliguri']">{errors.mobile}</p>
            )}
          </div>

          <div className="col-span-12 md:col-span-3 relative group">
            <label
              htmlFor="guardian_mobile"
              className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']"
            >
              অভিভাবকের মোবাইল <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="guardian_mobile"
              name="guardian_mobile"
              required
              placeholder="01XXXXXXXXX"
              className={`w-full p-3 border ${errors.guardian_mobile ? "border-red-500" : "border-[#FC5D43]"} rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 font-['Hind_Siliguri']`}
              style={{ backgroundColor: selectValues.guardian_mobile && selectValues.guardian_mobile.trim() ? '#E6F0FF' : `${primaryColor}4D` }}
              value={selectValues.guardian_mobile || ''}
              onChange={e => setSelectValues(v => ({ ...v, guardian_mobile: e.target.value }))}
            />
          </div>

          <div className="col-span-12 md:col-span-3 relative group">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
              ইমেইল
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              className="w-full p-3 border border-[#FC5D43] rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 font-['Hind_Siliguri']"
              style={{ backgroundColor: selectValues.email && selectValues.email.trim() ? '#E6F0FF' : `${primaryColor}4D` }}
              value={selectValues.email || ''}
              onChange={e => setSelectValues(v => ({ ...v, email: e.target.value }))}
            />
          </div>
        </div>

        {/* Row 4: 2 items equally divided left and right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <label
              htmlFor="current_address"
              className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']"
            >
              বর্তমান ঠিকানা
            </label>
            <textarea
              id="current_address"
              name="current_address"
              placeholder="আপনার বর্তমান ঠিকানা লিখুন"
              rows={4}
              className="w-full p-3 border border-[#FC5D43] rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 resize-none font-['Hind_Siliguri']"
              style={{ backgroundColor: selectValues.current_address && selectValues.current_address.trim() ? '#E6F0FF' : `${primaryColor}4D` }}
              value={selectValues.current_address || ''}
              onChange={e => setSelectValues(v => ({ ...v, current_address: e.target.value }))}
            ></textarea>
          </div>

          <div className="relative group">
            <label
              htmlFor="permanent_address"
              className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']"
            >
              স্থায়ী ঠিকানা
            </label>
            <textarea
              id="permanent_address"
              name="permanent_address"
              placeholder="আপনার স্থায়ী ঠিকানা লিখুন"
              rows={4}
              className="w-full p-3 border border-[#FC5D43] rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 resize-none font-['Hind_Siliguri']"
              style={{ backgroundColor: selectValues.permanent_address && selectValues.permanent_address.trim() ? '#E6F0FF' : `${primaryColor}4D` }}
              value={selectValues.permanent_address || ''}
              onChange={e => setSelectValues(v => ({ ...v, permanent_address: e.target.value }))}
            ></textarea>
          </div>
        </div>

        {/* Row 5: 2 items equally divided left and right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <label htmlFor="photo" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
              ছবি <span className="text-gray-500">(Max 50 KB)</span><span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                id="photo"
                name="photo"
                accept=".jpg,.jpeg,.png"
                className="w-full p-3 border border-[#FC5D43] rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                style={{ backgroundColor: `${primaryColor}4D` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">JPG, JPEG, PNG ফরম্যাট সাপোর্ট করে</p>
          </div>

          <div className="relative group">
            <label
              htmlFor="application_date"
              className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']"
            >
              আবেদনের তারিখ
            </label>
            <input
              type="date"
              id="application_date"
              name="application_date"
              className="w-full p-3 border border-[#FC5D43] rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 font-['Hind_Siliguri']"
              style={{ backgroundColor: selectValues.application_date ? '#E6F0FF' : `${primaryColor}4D` }}
              value={selectValues.application_date || ''}
              onChange={e => setSelectValues(v => ({ ...v, application_date: e.target.value }))}
            />
          </div>
        </div>

        {/* Submit button on the left */}
        <div className="flex justify-start mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`group relative px-8 py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-['Hind_Siliguri'] text-lg min-w-[200px] overflow-hidden ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            style={{
              background: `linear-gradient(90deg, ${buttonColor}, ${buttonColor}CC 80%)`
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">

              {isSubmitting ? "সাবমিট হচ্ছে..." : "সাবমিট করুন"}
            </span>
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(90deg, ${buttonColor}CC, ${buttonColor} 80%)`
              }}
            ></div>
          </button>
        </div>

  {/* Inline result box removed in favor of toast notifications */}
      </form >
    </div >
  );
};

export default AdmissionForm;