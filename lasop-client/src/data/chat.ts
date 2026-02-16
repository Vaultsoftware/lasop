interface OtherInfo {
    firstName: string;
    lastName: string;
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

interface StudentData {
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

interface StaffMain {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    address: string;
    nationality: string;
    dateOfEmploy: string;
    salary: string;
    password: string;
    otherInfo: OtherInfoData[];
    role: string;
    status: string;
    createdAt?: string;
}

interface MessageMain {
    _id: string;
    sender: StaffMain | StudentData;
    senderModel: 'Student' | 'Staff';
    reciever: string;
    recieverModel: 'Student' | 'Staff';
    messageType: 'text' | 'image' | 'file';
    message: string;
    fileUrl: string;
    seen: boolean;
    seenAt: string
    createdAt: string;
}

export const messages: MessageMain[] = [
  {
    _id: "msg_001",
    sender: {
      _id: "stu_001",
      firstName: "Ayo",
      lastName: "Okafor",
      email: "ayo.okafor@lasop.com",
      password: "hashed_pw_student",
      contact: "+1 306 555 0101",
      address: "12 Broad St, Regina, SK",
      program: [
        {
          courseId: "course_web_101",
          cohortId: "cohort_jan_2026",
          center: "Regina",
          mode: "Onsite",
        },
      ],
      allowed: true,
      status: "active",
      createdAt: "2026-01-10T09:10:00.000Z",
    },
    senderModel: "Student",
    reciever: "staff_001",
    recieverModel: "Staff",
    messageType: "text",
    message: "Good morning sir, please is today's class holding?",
    fileUrl: "",
    seen: true,
    seenAt: "2026-01-17T09:02:00.000Z",
    createdAt: "2026-01-17T08:58:00.000Z",
  },

  {
    _id: "msg_002",
    sender: {
      id: "staff_001",
      firstName: "Ben",
      lastName: "Halsall",
      email: "ben.halsall@lasop.com",
      contact: "+1 306 555 0202",
      address: "LASOP Center, Regina, SK",
      nationality: "Canadian",
      dateOfEmploy: "2024-02-01",
      salary: "65000",
      password: "hashed_pw_staff",
      otherInfo: [],
      role: "Instructor",
      status: "active",
      createdAt: "2024-02-01T10:00:00.000Z",
    },
    senderModel: "Staff",
    reciever: "stu_001",
    recieverModel: "Student",
    messageType: "text",
    message: "Yes, class is holding. Please be in by 10am.",
    fileUrl: "",
    seen: true,
    seenAt: "2026-01-17T09:06:00.000Z",
    createdAt: "2026-01-17T09:03:00.000Z",
  },

  {
    _id: "msg_003",
    sender: {
      _id: "stu_001",
      firstName: "Ayo",
      lastName: "Okafor",
      email: "ayo.okafor@lasop.com",
      password: "hashed_pw_student",
      contact: "+1 306 555 0101",
      address: "12 Broad St, Regina, SK",
      program: [
        {
          courseId: "course_web_101",
          cohortId: "cohort_jan_2026",
          center: "Regina",
          mode: "Onsite",
        },
      ],
      allowed: true,
      status: "active",
      createdAt: "2026-01-10T09:10:00.000Z",
    },
    senderModel: "Student",
    reciever: "staff_001",
    recieverModel: "Staff",
    messageType: "image",
    message: "I’ve attached a screenshot of my assignment.",
    fileUrl: "https://cdn.lasop.com/messages/assignment.png",
    seen: false,
    seenAt: "",
    createdAt: "2026-01-17T09:15:00.000Z",
  },

  {
    _id: "msg_004",
    sender: {
      id: "staff_001",
      firstName: "Ben",
      lastName: "Halsall",
      email: "ben.halsall@lasop.com",
      contact: "+1 306 555 0202",
      address: "LASOP Center, Regina, SK",
      nationality: "Canadian",
      dateOfEmploy: "2024-02-01",
      salary: "65000",
      password: "hashed_pw_staff",
      otherInfo: [],
      role: "Instructor",
      status: "active",
      createdAt: "2024-02-01T10:00:00.000Z",
    },
    senderModel: "Staff",
    reciever: "stu_001",
    recieverModel: "Student",
    messageType: "file",
    message: "Here’s the corrected PDF. Review section 3.",
    fileUrl: "https://cdn.lasop.com/files/corrections.pdf",
    seen: false,
    seenAt: "",
    createdAt: "2026-01-17T09:22:00.000Z",
  },

  {
    _id: "msg_005",
    sender: {
      _id: "stu_001",
      firstName: "Ayo",
      lastName: "Okafor",
      email: "ayo.okafor@lasop.com",
      password: "hashed_pw_student",
      contact: "+1 306 555 0101",
      address: "12 Broad St, Regina, SK",
      program: [
        {
          courseId: "course_web_101",
          cohortId: "cohort_jan_2026",
          center: "Regina",
          mode: "Onsite",
        },
      ],
      allowed: true,
      status: "active",
      createdAt: "2026-01-10T09:10:00.000Z",
    },
    senderModel: "Student",
    reciever: "staff_001",
    recieverModel: "Staff",
    messageType: "text",
    message: "Got it, thank you sir.",
    fileUrl: "",
    seen: false,
    seenAt: "",
    createdAt: "2026-01-17T09:25:00.000Z",
  },

  {
    _id: "msg_006",
    sender: {
      _id: "stu_001",
      firstName: "Ayo",
      lastName: "Okafor",
      email: "ayo.okafor@lasop.com",
      password: "hashed_pw_student",
      contact: "+1 306 555 0101",
      address: "12 Broad St, Regina, SK",
      program: [
        {
          courseId: "course_web_101",
          cohortId: "cohort_jan_2026",
          center: "Regina",
          mode: "Onsite",
        },
      ],
      allowed: true,
      status: "active",
      createdAt: "2026-01-10T09:10:00.000Z",
    },
    senderModel: "Student",
    reciever: "staff_001",
    recieverModel: "Staff",
    messageType: "text",
    message: "I will review it tonight and send it back.",
    fileUrl: "",
    seen: false,
    seenAt: "",
    createdAt: "2026-01-17T09:25:00.000Z",
  },
];

