interface OtherInfo {
    fName: string;
    lName: string;
    contact: string;
    address: string;
}

interface OtherInfoData {
    id?: string;
    staffId: string;
    kin: OtherInfo;
    guarantor1: OtherInfo;
    guarantor2: OtherInfo;
}

// Assessment types
export interface Assessment {
    title: string;
    instruction: string;
    dueDate: string;
    cohortId: string;
    courseId: string;
    center: string;
    mode: string;
    tutorId: string;
}

export interface Grade {
    assessmentId: string;
    studentId: string;
    grade: string;
    feedback: string;
}

export interface Answer {
    assessmentId: string;
    studentId: string;
    answer: string;
}

export interface SubmissionPayload {
    data?: {
        studentId: StudentDataMain;
        submitted: string;
        submissionDate: string;
        grade: string;
        answer: string;
        feedback: string;
        status: string
    }
    message?: string
}

export interface AssessmentMain {
    _id: string;
    title: string;
    instruction: string;
    submission: {
        studentId: StudentDataMain;
        submitted: string;
        submissionDate: string;
        grade: string;
        answer: string;
        feedback: string;
        status: string
    }[];
    dueDate: string;
    cohortId: CohortMain;
    courseId: {
        _id: string;
        title: string;
        code: string;
        price: string;
        exams: string[];
    };
    center: {
        _id?: string;
        title: string;
    };
    mode: string;
    tutorId: StaffMain;
    createdAt: string
}

export interface AssessmentResponsePayload {
    message?: string;
    data?: AssessmentMain;
}

// Certificate types
export interface Certificate {
    studentId: string;
    certTitle: string;
    certificate: any;
}

export interface CertificateMain {
    _id: string;
    studentId: StudentDataMain;
    certTitle: string;
    certificate: string;
}

export interface CertificatePayload {
    message?: string;
    data?: CertificateMain;
}

export interface UpdateCertificate {
    certId: string;
    certData: CertificateMain;
}

// Classroom types
export interface Classroom {
    title: string;
    cohortId: string;
    courseId: string;
    center: string;
    tutorId: string;
    mode: string;
    date: string;
    time: string;
    zoomLink: string;
    startClass?: boolean;
    duration: string;
    status: string;
}

export interface ClassroomMain {
    _id: string;
    title: string;
    cohortId: CohortMain;
    courseId: {
        _id: string;
        title: string;
        code: string;
        price: string;
        exams: string[];
    };
    center: {
        _id?: string;
        title: string;
    };
    tutorId: StaffMain;
    mode: string;
    date: string;
    time: string;
    zoomLink: string;
    startClass: boolean;
    attendance: StudentDataMain[];
    duration: string;
    status: string;
}

export interface ClassroomResponsePayload {
    message?: string;
    data?: ClassroomMain;
}

export interface UpdateClassroom {
    classId: string;
    classData: Partial<Classroom>;
}

export interface UpdateAttendance {
    classId: string;
    attendance: string[];
}

// Cohort type
export interface CohortData {
    cohortName: string;
    courseId: string[];
    startDate: string;
    endDate: string;
    center: string[];
    mode: string[];
    courseTutors: {
        course: string;
        center: string;
        mode: string;
        tutors: string;
    }[];
    isActive?: boolean;
    status?: string;
}

export interface UpdateCohort {
    updateCohort: Partial<CohortData>;
    cohortIdDet: string;
}

export interface CourseTutors {
    course: string;
    center: string;
    mode: string;
    tutors: string;
}

export interface AssignCohort {
    courseTutorData: CourseTutors;
    cohortIdDet: string;
}

export interface CohortMain {
    _id: string;
    cohortName: string;
    courseId: {
        _id: string;
        title: string;
        code: string;
        price: string;
        exams: string[];
    }[];
    startDate: string;
    endDate: string;
    center: {
        _id?: string;
        title: string;
    }[];
    mode: string[];
    courseTutors: {
        course: {
            _id: string;
            title: string;
            code: string;
            price: string;
            exams: string[];
        };
        center: {
            _id?: string;
            title: string;
        };
        mode: string;
        tutors: StaffMain;
    }[];
    isActive: boolean;
    status: string;
}

export interface CohortResponsePayload {
    message?: string;
    data?: CohortMain;
}

// Course types
export interface Course {
    _id: string;
    title: string;
    code: string;
    price: string;
    exams: string[];
}

export interface UpdateCourse {
    courseData: Partial<Course>;
    courseId: string;
}

export interface CourseResponsePayload {
    message?: string;
    data?: Course;
}

// Exam types
export interface ExamData {
    _id?: string;
    title: string;
    code: string;
    examUrl: string;
    status: string;
    duration: string;
    countDown: string;
    courseId: string;
}

export interface CohortExam {
    cohortId: string;
    examId: string;
    isActive: boolean;
    activatedAt: string;
}

export interface CohortExamResponsePayload {
    message?: string;
    data?: CohortExam;
}

export interface ExamResponsePayload {
    message?: string;
    data?: ExamData;
}

// Job types
export interface JobData {
    _id: string;
    jobTitle: string;
    salary: string;
    jobType: string;
    requirements: string;
    company: string;
    location: string;
    city: string;
    jobDescription: string;
}

export interface JobPayload {
    message?: string;
    data?: JobData
}

export interface UpdateJob {
    updateJobId: Partial<JobData>;
    jobId: string;
}

// Project types
export interface Project {
    title: string;
    duration: string;
    start: string;
    overview: string;
    objectives: string[];
    deliverables: string[];
    dueDate: string;
    cohortId: string;
    courseId: string;
    center: string;
    mode: string;
    tutorId: string;
}

export interface ProjectMain {
    _id: string;
    title: string;
    duration: string;
    start: string;
    overview: string;
    objectives: string[];
    deliverables: string[];
    submission: {
        studentId: StudentDataMain;
        submitted: string;
        submissionDate: string;
        grade: string;
        answer: string;
        feedback: string;
        status: string
    }[];
    dueDate: string;
    cohortId: CohortMain;
    courseId: {
        _id: string;
        title: string;
        code: string;
        price: string;
        exams: string[];
    };
    center: {
        _id?: string;
        title: string;
    };
    mode: string;
    tutorId: StaffMain;
    createdAt: string;
}

export interface GradeProject {
    projectId: string;
    studentId: string;
    grade: string;
    feedback: string;
}

export interface ProjectResponsePayload {
    message?: string;
    data?: ProjectMain;
}

export interface UpdateProject {
    projectId: string;
    projectData: Project;
}

export interface AnswerProject {
    projectId: string;
    studentId: string;
    answer: string;
}

// Result types
export interface CenterData {
    _id?: string;
    title: string;
}

export interface StudentData {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    contact: string;
    address: string;
    program: {
        courseId: string | any;
        cohortId: string | any;
        center: string | any;
        mode: string;
    }[];
    allowed: boolean;
    status: string;
    createdAt?: string;
}

export interface ResultData {
    studentId: string;
    cohortId: string;
    courseId: string;
    centerId: string;
    examTaken: {
        secttion: string;
        minutes: string;
        questions: string;
        correctScore: string;
        totalScore: string;
        status: string;
    }[]
}

export interface ResultMain {
    studentId: StudentData;
    cohortId: CohortMain;
    courseId: Course;
    centerId: CenterData;
    examTaken: {
        secttion: string;
        minutes: string;
        questions: string;
        correctScore: string;
        totalScore: string;
        status: string;
    }[]
}

export interface ResultPayload {
    message?: string;
    data?: ResultMain
}

// Staff types
export interface StaffData {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    address: string;
    password: string;
    role: string;
    enrol: string;
    status: string;
}

export interface StaffMain {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    address: string;
    dateOfEmploy: string;
    salary: string;
    password: string;
    otherInfo: OtherInfoData[];
    role: string;
    enrol: string;
    status: string;
    createdAt: string;
}

export interface LogStaff {
    email: string;
    password: string;
}

export interface StaffResponsePayload {
    message?: string;
    data?: StaffMain;
    token: string;
}

export interface OtherInfoResponsePayload {
    message?: string;
    data?: OtherInfoData;
}

// Student types
export interface StudentDataMain {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    contact: string;
    address: string;
    program: {
        courseId: string | any;
        cohortId: string | any;
        center: string | any;
        mode: string;
        tutorId: StaffMain
    };
    otherName: string;
    gender: string;
    allowed: boolean;
    status: string;
    createdAt: string;
}

export interface LogStudent {
    email: string;
    password: string;
}

export interface UpdateStudentPayload {
    updateData: Partial<StudentDataMain> | FormData;
    studentId: string;
}

export interface AddCourse {
    course: string;
    cohort: string;
    center: string;
    modes: string;
    payment: string | number | null;
}

export interface AddCoursePayload {
    courseData: AddCourse;
    studentId: string;
}

export interface StudentResponsePayload {
    message?: string;
    data?: StudentDataMain;
    token: string;
}

export interface ProfileDataMain {
    _id: string
    studentId: StudentDataMain;
    proPic: string;
    createdAt: string;
}

export interface ProfileData {
    studentId: string;
    proPic: any;
}

export interface ProfilePayload {
    message?: string;
    data?: ProfileDataMain;
}

export interface UpdateProfile {
    proId: string;
    proData: ProfileDataMain;
}