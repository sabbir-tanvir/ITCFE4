import { useEffect, useState } from "react";
import { Api_Base_Url, Site_Id } from "../config/api";
import { fetchSiteSettings } from "../config/siteSettingsApi";
import { useLocation } from "react-router-dom";


const AdmissionForm = () => {
  const [result, setResult] = useState("");
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

      case "mother_name":
        if (!value.trim()) return "মায়ের নাম প্রয়োজন";
        if (value.trim().length < 2) return "নাম কমপক্ষে ২ অক্ষর হতে হবে";
        if (!/^[a-zA-Z\u0980-\u09FF\s]+$/.test(value.trim()))
          return "নামে শুধুমাত্র অক্ষর ব্যবহার করুন";
        return "";

      case "mobile":
        if (!value.trim()) return "মোবাইল নম্বর প্রয়োজন";
        if (!/^(\+88|88)?(01[3-9]\d{8})$/.test(value.trim()))
          return "সঠিক মোবাইল নম্বর দিন (১১ ডিজিট)";
        return "";

      case "guardian_mobile":
        if (!value.trim()) return "অভিভাবকের মোবাইল নম্বর প্রয়োজন";
        if (!/^(\+88|88)?(01[3-9]\d{8})$/.test(value.trim()))
          return "সঠিক মোবাইল নম্বর দিন (১১ ডিজিট)";
        return "";

      case "email":
        if (!value.trim()) return "ইমেইল প্রয়োজন";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
          return "সঠিক ইমেইল ঠিকানা দিন";
        return "";

      case "date_of_birth":
        if (!value) return "জন্ম তারিখ প্রয়োজন";
        {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 5 || age > 100) return "বয়স ৫-১০০ বছরের মধ্যে হতে হবে";
        }
        return "";

      case "current_address":
        if (!value.trim()) return "বর্তমান ঠিকানা প্রয়োজন";
        if (value.trim().length < 10) return "ঠিকানা কমপক্ষে ১০ অক্ষর হতে হবে";
        return "";

      case "permanent_address":
        if (!value.trim()) return "স্থায়ী ঠিকানা প্রয়োজন";
        if (value.trim().length < 10) return "ঠিকানা কমপক্ষে ১০ অক্ষর হতে হবে";
        return "";

      case "course":
        if (!value) return "কোর্স নির্বাচন করুন";
        return "";

      case "gender":
        if (!value) return "লিঙ্গ নির্বাচন করুন";
        return "";

      case "occupation":
        if (!value) return "পেশা নির্বাচন করুন";
        return "";

      case "course_mode":
        if (!value) return "কোর্স মোড নির্বাচন করুন";
        return "";

      case "education":
        if (!value.trim()) return "শিক্ষাগত যোগ্যতা প্রয়োজন";
        if (value.trim().length < 5)
          return "শিক্ষাগত যোগ্যতা কমপক্ষে ৫ অক্ষর হতে হবে";
        return "";

      default:
        return "";
    }
  };

  const validateForm = (formData) => {
    const newErrors = {};
    let isValid = true;

    formData.forEach((value, key) => {
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
      setResult("Please fix the errors above before submitting.");
      return;
    }

    setIsSubmitting(true);
    setResult("Sending....");

    // Build FormData with backend field names, send null for empty optional fields
    const formData = new FormData();
    formData.append("site_id", Site_Id ? parseInt(Site_Id) : "");
    formData.append("name", rawForm.get("name") || null);
    formData.append("father_name", rawForm.get("father_husband_name") || null);
    formData.append("mother_name", rawForm.get("mother_name") || null);
    formData.append("gender", rawForm.get("gender") || null);
    formData.append("date_of_birth", rawForm.get("date_of_birth") || null);
    formData.append("occupation", rawForm.get("occupation") || null);
    formData.append("course_mode", rawForm.get("course_mode") || null);
    formData.append("education_qualification", rawForm.get("education") || null);
    formData.append("mobile", rawForm.get("mobile") || null);
    formData.append("guardian_mobile", rawForm.get("guardian_mobile") || null);
    formData.append("email", rawForm.get("email") || null);
    formData.append("present_address", rawForm.get("current_address") || null);
    formData.append("permanent_address", rawForm.get("permanent_address") || null);
    formData.append("data_of_application", rawForm.get("application_date") || null);

    // Image as file
    if (rawForm.get("photo") && rawForm.get("photo").name) {
      formData.append("student_img", rawForm.get("photo"));
    }

    // Courses as array
    if (rawForm.get("course")) {
      formData.append("courses", parseInt(rawForm.get("course")));
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

      // console.log("Response status:", response.status);
      const resultData = await response.json();
      // console.log("Response data:", resultData);

      if (response.ok) {
        if (resultData.results && resultData.results.length > 0) {
          setResult("Form Submitted Successfully! Student registered.");
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
          setResult(resultData.message);
        } else {
          setResult("Form Submitted Successfully!");
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
        setResult(
          resultData.message ||
          resultData.error ||
          `Submission failed (${response.status})`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setResult("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-[1440px] mx-auto p-6  mt-[40px] mb-[80px] bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 font-['Hind_Siliguri']">
          এডমিশন ফর্ম
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full"></div>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">

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
                মায়ের নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="mother_name"
                name="mother_name"
                required
                placeholder="মায়ের নাম"
                className={`w-full p-3 border ${errors.mother_name ? "border-red-500" : "border-[#FC5D43]"} rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 font-['Hind_Siliguri']`}
                style={{ backgroundColor: selectValues.mother_name && selectValues.mother_name.trim() ? '#E6F0FF' : `${primaryColor}4D` }}
                value={selectValues.mother_name || ''}
                onChange={e => setSelectValues(v => ({ ...v, mother_name: e.target.value }))}
              />
              {errors.mother_name && (
                <p className="mt-1 text-sm text-red-600 font-['Hind_Siliguri']">{errors.mother_name}</p>
              )}
            </div>

            <div className="relative group">
              <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
                লিঙ্গ <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                required
                className={`w-full p-3 border ${errors.gender ? "border-red-500" : "border-[#FC5D43]"} rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300 font-['Hind_Siliguri']`}
                style={{ backgroundColor: selectValues.gender ? '#E6F0FF' : `${primaryColor}4D`, appearance: 'none' }}
                value={selectValues.gender}
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
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600 font-['Hind_Siliguri']">{errors.gender}</p>
              )}
            </div>
          </div>

          {/* Second half - 3 items equally divided */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="relative group">
              <label
                htmlFor="date_of_birth"
                className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']"
              >
                জন্ম তারিখ <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                required
                className={`w-full p-3 border ${errors.date_of_birth ? "border-red-500" : "border-[#FC5D43]"} rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 font-['Hind_Siliguri']`}
                style={{ backgroundColor: selectValues.date_of_birth ? '#E6F0FF' : `${primaryColor}4D` }}
                value={selectValues.date_of_birth}
                onChange={e => setSelectValues(v => ({ ...v, date_of_birth: e.target.value }))}
              />
              {errors.date_of_birth && (
                <p className="mt-1 text-sm text-red-600 font-['Hind_Siliguri']">{errors.date_of_birth}</p>
              )}
            </div>

            <div className="relative group">
              <label htmlFor="occupation" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
                পেশা <span className="text-red-500">*</span>
              </label>
              <select
                id="occupation"
                name="occupation"
                required
                className={`w-full p-3 border ${errors.occupation ? "border-red-500" : "border-[#FC5D43]"} rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300 font-['Hind_Siliguri']`}
                style={{ backgroundColor: selectValues.occupation ? '#E6F0FF' : `${primaryColor}4D`, appearance: 'none' }}
                value={selectValues.occupation}
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
              {errors.occupation && (
                <p className="mt-1 text-sm text-red-600 font-['Hind_Siliguri']">{errors.occupation}</p>
              )}
            </div>

            <div className="relative group">
              <label htmlFor="course_mode" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
                কোর্স মোড <span className="text-red-500">*</span>
              </label>
              <select
                id="course_mode"
                name="course_mode"
                required
                className={`w-full p-3 border ${errors.course_mode ? "border-red-500" : "border-[#FC5D43]"} rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300 font-['Hind_Siliguri']`}
                style={{ backgroundColor: selectValues.course_mode ? '#E6F0FF' : `${primaryColor}4D`, appearance: 'none' }}
                value={selectValues.course_mode}
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
              {errors.course_mode && (
                <p className="mt-1 text-sm text-red-600 font-['Hind_Siliguri']">{errors.course_mode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: 4 items - 1st and 4th take 2 parts each, 2nd and 3rd take 2 parts together */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 relative group">
            <label htmlFor="education" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
              সর্বোচ্চ শিক্ষাগত যোগ্যতা <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="education"
              name="education"
              placeholder="যেমন: এইচএসসি, জিপিএ ৪.৫"
              required
              className={`w-full p-3 border ${errors.education ? "border-red-500" : "border-[#FC5D43]"} rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 font-['Hind_Siliguri']`}
              style={{ backgroundColor: selectValues.education && selectValues.education.trim() ? '#E6F0FF' : `${primaryColor}4D` }}
              value={selectValues.education || ''}
              onChange={e => setSelectValues(v => ({ ...v, education: e.target.value }))}
            />
            {errors.education && (
              <p className="mt-1 text-sm text-red-600 font-['Hind_Siliguri']">{errors.education}</p>
            )}
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
            {errors.guardian_mobile && (
              <p className="mt-1 text-sm text-red-600 font-['Hind_Siliguri']">{errors.guardian_mobile}</p>
            )}
          </div>

          <div className="col-span-12 md:col-span-3 relative group">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']">
              ইমেইল <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="example@gmail.com"
              className={`w-full p-3 border ${errors.email ? "border-red-500" : "border-[#FC5D43]"} rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 font-['Hind_Siliguri']`}
              style={{ backgroundColor: selectValues.email && selectValues.email.trim() ? '#E6F0FF' : `${primaryColor}4D` }}
              value={selectValues.email || ''}
              onChange={e => setSelectValues(v => ({ ...v, email: e.target.value }))}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 font-['Hind_Siliguri']">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Row 4: 2 items equally divided left and right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <label
              htmlFor="current_address"
              className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']"
            >
              বর্তমান ঠিকানা <span className="text-red-500">*</span>
            </label>
            <textarea
              id="current_address"
              name="current_address"
              required
              placeholder="আপনার বর্তমান ঠিকানা লিখুন"
              rows={4}
              className={`w-full p-3 border ${errors.current_address ? "border-red-500" : "border-[#FC5D43]"} rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 resize-none font-['Hind_Siliguri']`}
              style={{ backgroundColor: selectValues.current_address && selectValues.current_address.trim() ? '#E6F0FF' : `${primaryColor}4D` }}
              value={selectValues.current_address || ''}
              onChange={e => setSelectValues(v => ({ ...v, current_address: e.target.value }))}
            ></textarea>
            {errors.current_address && (
              <p className="mt-1 text-sm text-red-600 font-['Hind_Siliguri']">{errors.current_address}</p>
            )}
          </div>

          <div className="relative group">
            <label
              htmlFor="permanent_address"
              className="block text-sm font-semibold text-gray-700 mb-2 font-['Hind_Siliguri']"
            >
              স্থায়ী ঠিকানা <span className="text-red-500">*</span>
            </label>
            <textarea
              id="permanent_address"
              name="permanent_address"
              required
              placeholder="আপনার স্থায়ী ঠিকানা লিখুন"
              rows={4}
              className={`w-full p-3 border ${errors.permanent_address ? "border-red-500" : "border-[#FC5D43]"} rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 resize-none font-['Hind_Siliguri']`}
              style={{ backgroundColor: selectValues.permanent_address && selectValues.permanent_address.trim() ? '#E6F0FF' : `${primaryColor}4D` }}
              value={selectValues.permanent_address || ''}
              onChange={e => setSelectValues(v => ({ ...v, permanent_address: e.target.value }))}
            ></textarea>
            {errors.permanent_address && (
              <p className="mt-1 text-sm text-red-600 font-['Hind_Siliguri']">{errors.permanent_address}</p>
            )}
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
              আবেদনের তারিখ <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="application_date"
              name="application_date"
              required
              className={`w-full p-3 border ${errors.application_date ? "border-red-500" : "border-[#FC5D43]"} rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-gray-300 font-['Hind_Siliguri']`}
              style={{ backgroundColor: selectValues.application_date ? '#E6F0FF' : `${primaryColor}4D` }}
              value={selectValues.application_date}
              onChange={e => setSelectValues(v => ({ ...v, application_date: e.target.value }))}
            />
            {errors.application_date && (
              <p className="mt-1 text-sm text-red-600 font-['Hind_Siliguri']">{errors.application_date}</p>
            )}
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

        {/* Result message */}
        {/* {
          result && (
            <div className={`mt-4 p-3 rounded-lg font-semibold text-left font-['Hind_Siliguri'] max-w-md ${result === "Form Submitted Successfully"
              ? "bg-green-100 text-green-700 border border-green-300"
              : result === "Sending...."
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-red-100 text-red-700 border border-red-300"
              }`}>
              {result}
            </div>
          )
        } */}
      </form >
    </div >
  );
};

export default AdmissionForm;