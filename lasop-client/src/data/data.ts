// src/data/data.ts
import { GoLocation } from "react-icons/go";
import info from '../asset/landPage/info.jpeg';
import study from '../asset/landPage/study.jpeg';
import work from '../asset/landPage/work.jpeg';
import blogImg from '../asset/landPage/blog.jpg';
import team1 from '../asset/images/t1.png';
import team2 from '../asset/images/t2.png';
import team3 from '../asset/images/t3.png';
import team4 from '../asset/images/t4.png';
import team5 from '../asset/images/t5.png';
import team6 from '../asset/images/t6.png';
import corCon1 from '../asset/images/full.png';
import corCon2 from '../asset/images/mob.png';
import corCon3 from '../asset/images/full.png';
import corCon4 from '../asset/images/backend.png';
import corCon5 from '../asset/images/ui.png';
import corCon6 from '../asset/images/ds.png';
import proImg1 from "../asset/images/mrdavid.png";
import proImg2 from "../asset/images/class3.png";
import proImg3 from "../asset/images/opclass.png";
import proImg4 from "../asset/images/opclass2.png";
import proImg5 from "../asset/images/opstud.png";
import proCon1 from "../asset/images/opicon.png";
import proCon2 from "../asset/images/opicon5.png";
import proCon3 from "../asset/images/opicon4.png";
import proCon4 from "../asset/images/opicon3.png";
import proCon5 from "../asset/images/opicon4.png";
import learnCon1 from "../asset/images/Frame147.png";
import learnCon2 from "../asset/images/02.png";
import learnCon3 from "../asset/images/03.png";
import cohort from '../asset/dashIcon/cohort.png';
import center from '../asset/dashIcon/center.png';
import complete from '../asset/dashIcon/complete.png';
import courses from '../asset/dashIcon/course.png';
import graduate from '../asset/dashIcon/graduate.png';
import newApp from '../asset/dashIcon/new.png';
import student from '../asset/dashIcon/student.png';
import staff from '../asset/dashIcon/staff.png';

interface CourseOffer {
    id: number,
    title: string,
    info: string,
    img: string,
    slug: string,
    icon: any,
    link: string
}

export const courseOffer: CourseOffer[] = [
    {
        id: 1,
        title: "fullstack development",
        info: "Learn to create professional, responsive websites using HTML, CSS, Bootstrap, JavaScript, JQuery, React, Python, Django & SQL.",
        img: "full.png",
        slug: "fullstack",
        icon: corCon1,
        link: '/course/fullstack'
    },
    {
        id: 2,
        title: "mobile app development",
        info: "Learn to create mobile UI designs with native frameworks or cross-platform frameworks, React Native, Flutter",
        img: "mob.png",
        slug: "App Development",
        icon: corCon2,
        link: '/course/mobileapp'

    },
    {
        id: 3,
        title: "frontend development",
        info: "Learn to create professional, responsive websites using HTML, CSS, Bootstrap, JavaScript, JQuery, React, & SQL.",
        img: "full.png",
        slug: "frontend",
        icon: corCon3,
        link: '/course/Frontend'
    },
    {
        id: 4,
        title: "Cyber security",
        info: "Our cyber security course covers general introductory, operating systems, networking, cryptography, web security, compliance, forensic, and ETHICAL HACKING, and it's capped with project/course defence.",
        img: "backend.png",
        slug: "backend",
        icon: corCon4,
        link: '/course/Backend'
    },
    {
        id: 5,
        title: "UI/UX design",
        info: "Learn design thinking, wireframes, interactive prototyping. Earn a UX design certification to accelerate your career with cutting-edge skills.",
        img: "ui.png",
        slug: "Product Design",
        icon: corCon5,
        link: '/course/productdesign'
    },
    {
        id: 6,
        title: "Data science and AI",
        info: "Dive into prescriptive and predictive analysis, machine learning, artificial intelligence, statistical analysis, and programming languages.",
        img: "ds.png",
        slug: "data-science & ai",
        icon: corCon6,
        link: '/course/datascience'
    },
]

interface Learn {
    img: any,
    title: string,
    content: string,
    imgAlt: string,
    icon: any,
    order: number
}

export const learn: Learn[] = [
    {
        img: info,
        title: "Information",
        content: "Find out about the opportunities waiting for you at LASOP. Learn from the best counsellors, tutors and mentors. You need more attention than money at this time. Find out more about your talent and how to polish it into a profitable skill.",
        imgAlt: "",
        icon: learnCon1,
        order: 1
    },
    {
        img: study,
        title: "Study",
        content: "Experience the most exciting part of being a LASOP Alumni even before your course ends. Join in escalating the tradition of being hired while you are still in campus since you have truly elevated yourself. The journey will remain rewarding since you dared to sacrifice to learn only from the best.",
        imgAlt: "",
        icon: learnCon2,
        order: 2
    },
    {
        img: work,
        title: "Work",
        content: "Find out about the opportunities waiting for you at LASOP. Learn from the best counsellors, tutors and mentors. You need more attention than money at this time. Find out more about your talent and how to polish it into a profitable skill.",
        imgAlt: "",
        icon: learnCon3,
        order: 3
    }
];

interface Programs {
    img: any,
    icon: any,
    title: string,
    content: string,
    imgAlt: string,
    iconAlt: string,
    order: number
}

export const programs: Programs[] = [
    {
        img: proImg1,
        icon: proCon1,
        title: "Conducive learning atmosphere",
        content: "Safe and serene environment, well air-conditioned and clean class rooms customized with state of the art facilities and equipment’s and hybrid libraries for self-study. Internet and software’s available when needed.",
        imgAlt: "",
        iconAlt: "",
        order: 1
    },
    {
        img: proImg2,
        icon: proCon2,
        title: "Hands on practice everyday",
        content: "Put your training into practice, Learn to build practically. There is no substitution for pressing the keyboards, writing codes, sketching designs and finalizing projects for deployments and dominion.",
        imgAlt: "",
        iconAlt: "",
        order: 2
    },
    {
        img: proImg3,
        icon: proCon3,
        title: "Learn from senior faculties",
        content: "Experienced and well educated tutors will take you through the lessons and continue to mentor you throughout your course. They do not only have the knowledge, they are very gifted in the art of teaching.",
        imgAlt: "",
        iconAlt: "",
        order: 3
    },
    {
        img: proImg4,
        icon: proCon4,
        title: "Project and Profiles",
        content: "Data science students deploy machine models into specialized products. The models are tested and evaluated. Software developers must build market-fit functional products, so should designers.",
        imgAlt: "",
        iconAlt: "",
        order: 4
    },
    {
        img: proImg5,
        icon: proCon5,
        title: "Efficient",
        content: "We do not give excuses at LASOP. Things are always done well.",
        imgAlt: "",
        iconAlt: "",
        order: 5
    }
];

interface Testimony {
    id: number,
    name: string,
    color: string,
    body: string
}

export const testimony: Testimony[] = [
    {
        id: 1,
        name: 'Christian Amienghen',
        color: "#FF7F00",
        body: "As someone who had no background knowledge about web-development or programming of any sorts, I can boldly say that LASOP is the best institute for learning anything you want about programming. They carry all the students along through the journey from beginner to pro and they ensure that they are independent in writing properly functioning codes. "
    },
    {
        id: 2,
        name: 'Mary Seghosime',
        color: "#ddcffb",
        body: "I am currently taking my tech training at Lasop Berger centre. It has been an amazing journey. The tutor has been very helpful and the environment so condusive. If you are looking for a place to start your tech career, i highly recommend Lasop. "
    },
    {
        id: 3,
        name: 'Josh Ose',
        color: "#a4aafd",
        body: "Lectures have been great. The tutor is patient and has good communication skills, people-oriented, and ability to pass knowledge."
    },
]

interface Faqs {
    title: string,
    content: string
}

export const faqs: Faqs[] = [
    {
        title: "I don’t have any background knowledge in programming, can I apply ?",
        content: `Yes, you can. You don’t need any background knowledge in IT or coding before you can register. Having one is only an advantage for you. At LASOP, we start from the basics and guide you through all you need to know to be a successful software developer.`,
    },
    {
        title: "What Must I Do To Be Successful In The Program ?",
        content: "Be aware that your success is our priority. To be successful in the program, you must get yourself fully involved by not missing lesson periods, actively obeying instructors, mentors and even classmates. You must also practice constantly and execute real life projects.",
    },
    {
        title: "What Materials Do I Need For This Program ?",
        content: `For your training, you need a laptop (Mac, Linus or PC) with a minimum of 4GB ram, and a storage capacity of at least 250GB.Every other software will be installed with the help of our experts before the beginning of the course. `,
    },
    {
        title: "What Are My Expectations At The End Of The Program ?",
        content: "By the end of this course must have: Completed several individual and group projects, Learned about software development from our experienced developers, Be equipped with all the foundational knowledge needed for your new career.",
    },
    {
        title: "I have basic knowledge in software development already. Do you have an advanced package for me ?",
        content: "Yes, at LASOP, we offer advanced training to people who have completed a course(s) in programming, but wish to learn more.",
    },
    {
        title: "Can we register for courses online via the website ?",
        content: "Yes. Payments are made to LASOP official accounts through any of Mobile payments, electronic bank transfers, USSD or bank teller system.",
    },
    {
        title: "Is Lagos School of Programming government owned ?",
        content: "Lagos School of Programming Limited is a private owned company, approved by government.",
    },
    {
        title: "How Much Is Course fee ?",
        content: "Course fee is variant, depending on the course one decides to go for. Visit course pages for details",
    },
    {
        title: "Is ther any other payment aside course fee?",
        content: "No, there is no other payment",
    },
    {
        title: "What are the courses offered ?",
        content: "The courses available across our centers are: Fullstack Web Development, Frontend Web Development, Backend Web Development, Mobile App Development, UI/UX, Machine Learning and AI, Data Science and Data Analysis",
    },
    {
        title: "Who can enrol ?",
        content: "Anyone between the ages of 15-65, irrespective of educational status can enrol",
    },
    {
        title: "Is certificate given upon graduation ?",
        content: "Yes, a certificate is issued upon graduation",
    }
];

interface Blog {
    id: string,
    title: string,
    content: string,
    img: any,
    date: string,
    time: string
}

export const blog: Blog[] = [
    {
        id: '1',
        title: 'The Future of Web Development',
        content: 'Web development is evolving rapidly with the introduction of new technologies and frameworks. In this blog, we explore the future trends in web development and how to stay ahead of the curve.',
        img: blogImg,
        date: '2024-07-31',
        time: '10:00 AM',
    },
    {
        id: '2',
        title: 'Understanding React Hooks',
        content: 'React hooks have revolutionized the way we write React components. This blog provides an in-depth look at various hooks, how they work, and best practices for using them in your projects.',
        img: blogImg,
        date: '2024-07-30',
        time: '11:00 AM',
    },
    {
        id: '3',
        title: 'A Guide to TypeScript',
        content: 'TypeScript brings strong typing to JavaScript, making it a powerful tool for large-scale applications. In this blog, we discuss the benefits of TypeScript and how to integrate it into your existing projects.',
        img: blogImg,
        date: '2024-07-29',
        time: '12:00 PM',
    }
]

interface CourseData {
    id: number;
    dpt1: string;
    title: string;
    dpt2: string;
    bannerText: string;
    bannerBtn: { text: string }[];
    courseInfo: { curr: string; text: string }[];
    packageBtn: { title: string; info: string[] }[];
}

export const course: CourseData[] = [
    {
        id: 0,
        dpt1: `Product Design`,
        title: 'productdesign',

        dpt2: "(UI/UX  & PRODUCT LIFECYCLE)",
        bannerText: `Learn design thinking, wireframes, interactive prototyping, Figma, and more, and
        complete hands-on projects. Learn Essential UX Design Skills Led by Experienced
        Design Leaders UX Designers craft exceptional experiences within digital products,
        playing a critical role within the digital world. In this course, discover the UX design
        process and learn best practices for conducting research, creating wireframes, and
        applying user-centered design principles to create experience-focused digital
        solutions. UI Designers play a critical role on any digital team by creating pixel-perfect
        user interface designs that represent delightful and intuitive digital products. Through
        this program, learn visual design principles and industry tools to create beautiful,
        functional, and interactive interfaces that resonate with users and also learn every
        other skill it takes to put a perfect brand together.`,
        bannerBtn: [
            { text: "Ojodu-Berger" },
            { text: "6 months" },

            { text: "Campus" },
            { text: "Online" },
            { text: "Weekdays" },
            { text: "Weekends" },
        ],

        courseInfo: [
            {
                curr: "UX Research & Strategy",
                text: "Good user experience design starts with good research and strategy to address user problems. Learn the foundational concepts of Design Thinking and human-centered design, which are critical, early concepts that will inform your work. Learn how to complete effective research and develop user personas based on the insights you’ve gathered. This unit covers the essential foundations of the design process, to ensure you’re setting yourself up for success as you embark on your UX design journey."
            },
            {
                curr: "UI Designs Foundation",
                text: `Beautiful UI solutions are built upon the right framework and mindset. In this unit, develop strong design foundations by familiarizing yourself with common UI elements, best practices, and concepts. \n Learn human-centered design principles and apply your new knowledge to plan intuitive interfaces that resonate with users. Practice creating sketches and translate them into wireframes using Figma – an industry-leading tool used throughout the course.Learn and Apply Design Thinking Perform Effective User Research
            \nDevelop User Personas That Work
            \nExplore UI Elements, Patterns, and Concepts
            \nLearn Essential Principles for Impactful Designs
            \nDraft Designs with Sketches & Wireframes `},
            {
                curr: "Planning Design Solution",
                text: "With a strong understanding of your users, you’re ready to begin structuring your solution. Learn the tools to accelerate your workflow, including card sorting, tree testing, and more, through hands-on projects designed to help you begin building useful wireflows to explore solutions and demonstrate them to others. Explore interaction design and, by applying an iterative approach as part of your design process, you’ll be on the path of great UX designers"
            },
            {
                curr: "Visual Design Solution",
                text: `With your designs planned through sketches and wireframes, you are ready to begin adding layers of detail and refinement. In this unit, you will learn critical concepts for visual design, creating structure, deepening communication, and supporting accessibility. Explore ideas like color contrast and visual identity, along with accessibility tools and best practices for visual design.

            \nBuild Information Architecture
            \nLearn and Apply Design Exercises
            \nApply Iterative Design Processes
            \nBuild Structured, Clear, and Intuitive Interfaces
            \nCreate Compelling Visuals by Applying Color Theory`},
            {
                curr: "Visual Design And Building Prototype",
                text: "Iterative design means developing higher-fidelity designs as concepts are demonstrated and tested. Get hands-on practice creating wireframes of different fidelities, and use them to build interactive prototypes to test the user experience you have designed. Learn the basics of user interface design to understand how to convert your wireframes into full-fidelity final designs."
            },
            {
                curr: "Responsive Design And Prototyping",
                text: `Modern design needs to accommodate the wide range of devices in today's technology ecosystem. In this unit, you will explore how to adapt your designs to a variety of responsive layouts and practice creating interactive prototypes to test your designs and define a near-complete experience. Finally, you'll explore key motion and interaction design principles, learning how these concepts should be used to enhance your designs and bring them to life.

            \nCreate Wireframes in Multiple Fidelities
            \nBuild Interactive Prototypes to See Your Designs in Action
            \nDiscover User Interface Design Fundamentals
            \nExplore Responsive and Mobile App Interfaces
            \nBuild Interactive Prototypes to See Your Designs in Action
            \nLearn Interaction Design and Animation Principles`},
            {
                curr: "Communicating Design Solution",
                text: "To complete this UX design curriculum, learn the core components of usability and how to complete user testing throughout the design process. Explore accessibility principles and how to create inclusive designs."
            },
            {
                curr: "Industry WorkFlow And Development",
                text: "A UI Designer works as part of a group, contributing their designs to a larger project. In this unit, you will learn how to prepare your designs for other teams by leveraging the Design Quality Assurance process. You'll also explore how to use Figma for design handoff and collaboration with developers. Finally, you'll learn about the importance of design portfolios, round out your knowledge with additional concepts, and familiarize yourself with what's in store for the future of UI design."
            },
            {
                curr: "How to Design and Test for Usability",
                text: `Learn Accessibility Principles
            \nLearn Industry Workflows and Design Handoff
            \nExplore Design Systems & Portfolios
            \nUnderstand Future Trends in UI Design`},
        ],
        packageBtn: [
            {
                title: "Entry Requirement",
                info: [
                    "Basic computer literacy such as ability to type texts on MS Word is encouraged but however, we take students of this course from the scratch or as they are to where they need to be.",
                    "Students should have a personal laptop computer. ",
                    "Students must be serious-minded and well behaved.",
                    "Laptop (Mac, Linux, PC) with minimum capacities of 4GB RAM and 250GB of storage capacity.",
                    "Tuition Fee"
                ]
            },
            {
                title: "Tuition Fee",
                info: ["N 250,000 for Nigerians", "50% More for foreign students"]
            },
            {
                title: "Lectures & Assesments",
                info: [
                    "Students should have a personal laptop computer. ",
                    "Tuition Fee"
                ]
            },
            {
                title: "Careers",
                info: [
                    "LASOP boast of 99% job placement cohort on cohort from the very first batch. We have a special placement team that ensure that our graduands are well hired locally and internationally.",
                    "From banking to manufacturing and unto non-profit, our engineers have distinguished themselves as the true testament to our resilience and obsession for quality."
                ]
            }
        ]

    },
    {
        id: 1,
        dpt1: "Frontend",
        title: 'frontend',
        dpt2: "Development",
        bannerText: `Learn Web Development Skills Live, Led by Experienced Technology Leaders
        Having a strong online presence is essential to nearly every business. In this
        course, learn to create beautiful, responsive websites by mastering the building
        blocks of the Web: HTML, CSS, and the others mentioned above. Get hands-on
        experience applying these skills to build a professional website of your choice.`,
        bannerBtn: [
            { text: "Ojodu-Berger" },
            { text: "Weekdays" },
            { text: "weekends" },
            { text: "3 months" },
        ],

        courseInfo: [
            {
                curr: "Markup And HTML",
                text: "Launch into this course by gaining foundational knowledge of the internet and how developers build websites. You'll get hands-on experience setting up your development environment and writing HTML code, learning critical aspects of syntax and anatomy. Complete your first development challenge and apply everything you've learned so far."
            },
            {
                curr: "CSS Visual Styling",
                text: "Cascading Style Sheets (CSS) is the language that enables Web Developers to modify the appearance of a website with custom styling and advanced layouts. In this unit, learn how to connect CSS files with your HTML files, and start writing CSS code to apply unique styles to your website, including fonts and colors. Learn how to use the cascading logic of CSS and different selectors to precisely style your website."
            },
            {
                curr: "CSS Application To Your Html",
                text: "Learn how to link your CSS to HTML so you can begin applying custom styling to your websites. Understand CSS Cascade & Specificity Get hands-on practice exploring the logic behind CSS and how it is interpreted by web browsers, so you can apply custom styles throughout your website."
            },
            {
                curr: "Discover CSS Selector",
                text: "Learn the different CSS selectors and how to use them, allowing you to write clear, purposeful code and fine-tune your styling by selecting specific elements for customization."
            },
            {
                curr: "Apply Custom Fonts",
                text: "Discover how custom fonts are applied to your HTML code using CSS, and practice implementing custom typography within your website."
            },
            {
                curr: "Flexible Layout And Web Components",
                text: "Modern websites feature complex, flexible layouts. Learn how to achieve this within your own code by learning flexbox and more advanced CSS. Explore the concept of components and how they simplify UI design and implementation, and practice applying component thinking to your web development projects."
            },
            {
                curr: "Responsive Designs And Web Concept",
                text: "The modern web is dominated by devices of all shapes and sizes. As a result, responsive design has emerged as the essential process of designing and building webpages to elegantly adapt to any device size, from desktop computers through to mobile phones. Learn how to use media queries to implement responsive design, and explore best practices used in the industry. Finally, explore some advanced web development topics where you can continue your learning beyond the class."
            },
            {
                curr: "Javascript",
                text: "Now, make your websites interactive with Javascript then, understand how to enhance your coding lines with React and Jquery."
            },
            {
                curr: "API And Version Control",
                text: "Learn to fetch data from Rest Api(s) and version control like Git"
            },
            {
                curr: "Database Management And Hosting",
                text: "You will learn SQL database and how to make your application on cloud"
            },
        ],
        packageBtn: [
            {
                title: "Entry Requirement",
                info: [
                    "Basic computer literacy such as ability to type texts on MS Word is encouraged but however, we take students of this course from the scratch or as they are to where they need to be.",
                    "Students should have a personal laptop computer. ",
                    "Students must be serious-minded and well behaved.",
                    "Laptop (Mac, Linux, PC) with minimum capacities of 4GB RAM and 250GB of storage capacity.",
                    "Tuition Fee"
                ]
            },
            {
                title: "Tuition Fee",
                info: ["N 300,000 for Nigerians", "50% More for foreign students"]
            },
            {
                title: "Lectures & Assesments",
                info: [
                    "Students should have a personal laptop computer. ",
                    "Tuition Fee"
                ]
            },
            {
                title: "Careers",
                info: [
                    "LASOP boast of 99% job placement cohort on cohort from the very first batch. We have a special placement team that ensure that our graduands are well hired locally and internationally.",
                    "From banking to manufacturing and unto non-profit, our engineers have distinguished themselves as the true testament to our resilience and obsession for quality."
                ]
            }
        ]

    },
    {
        id: 2,
        dpt1: "Fullstack",
        title: 'Fullstack',
        dpt2: "Development",
        bannerText: `Learn to create professional, and responsive web apps using HTML,
        CSS, Bootstrap, JavaScript, JQuery, React, Python, Django & SQL.
        Understand GIT and GITHUBS, APIS and HOSTINGS
        At the end of this course , you would be able to build web apps for
        products like JUMIA, PAYSTACK, and even social media apps like
        FACEBOOK`,
        bannerBtn: [
            { text: "Ojodu-Berger" },
            { text: "Weekdays Mode AVailable" },
            { text: "Weekends Mode AVailable" },
            { text: "6 months" },
            { text: "Online Mode AVailable" },
        ],

        courseInfo: [
            {
                curr: "Markup And HTML",
                text: "Launch into this course by gaining foundational knowledge of the internet and how developers build websites. You'll get hands-on experience setting up your development environment and writing HTML code, learning critical aspects of syntax and anatomy. Complete your first development challenge and apply everything you've learned so far."
            },
            {
                curr: "CSS Visual Styling",
                text: "Cascading Style Sheets (CSS) is the language that enables Web Developers to modify the appearance of a website with custom styling and advanced layouts. In this unit, learn how to connect CSS files with your HTML files, and start writing CSS code to apply unique styles to your website, including fonts and colors. Learn how to use the cascading logic of CSS and different selectors to precisely style your website."
            },
            {
                curr: "CSS Application To Your Html",
                text: "Learn how to link your CSS to HTML so you can begin applying custom styling to your websites. Understand CSS Cascade & Specificity Get hands-on practice exploring the logic behind CSS and how it is interpreted by web browsers, so you can apply custom styles throughout your website."
            },
            {
                curr: "Discover CSS Selector",
                text: "Learn the different CSS selectors and how to use them, allowing you to write clear, purposeful code and fine-tune your styling by selecting specific elements for customization."
            },
            {
                curr: "Apply Custom Fonts",
                text: "Discover how custom fonts are applied to your HTML code using CSS, and practice implementing custom typography within your website."
            },
            {
                curr: "Flexible Layout And Web Components",
                text: "Modern websites feature complex, flexible layouts. Learn how to achieve this within your own code by learning flexbox and more advanced CSS. Explore the concept of components and how they simplify UI design and implementation, and practice applying component thinking to your web development projects."
            },
            {
                curr: "Responsive Designs And Web Concept",
                text: "The modern web is dominated by devices of all shapes and sizes. As a result, responsive design has emerged as the essential process of designing and building webpages to elegantly adapt to any device size, from desktop computers through to mobile phones. Learn how to use media queries to implement responsive design, and explore best practices used in the industry. Finally, explore some advanced web development topics where you can continue your learning beyond the class."
            },
            {
                curr: "Javascript",
                text: "Now, make your websites interactive with Javascript then, understand how to enhance your coding lines with React and Jquery."
            },
            {
                curr: "API And Version Control",
                text: "Learn to fetch data from Rest Api(s) and version control like Git"
            },
            {
                curr: "Backend Languages",
                text: "From Python to Database management, let us train you on how the backend of the web machines works together. Prepare yourself for a complete knowledge and have an advantage over the rest."
            },
        ],
        packageBtn: [
            {
                title: "Entry Requirement",
                info: [
                    "Basic computer literacy such as ability to type texts on MS Word is encouraged but however, we take students of this course from the scratch or as they are to where they need to be.",
                    "Students should have a personal laptop computer. ",
                    "Students must be serious-minded and well behaved.",
                    "Laptop (Mac, Linux, PC) with minimum capacities of 4GB RAM and 250GB of storage capacity.",
                    "Tuition Fee"
                ]
            },
            {
                title: "Tuition Fee",
                info: ["N 400,000 for Nigerians", "50% More for foreign students"]
            },
            {
                title: "Lectures & Assesments",
                info: [
                    "Students should have a personal laptop computer. ",
                    "Tuition Fee"
                ]
            },
            {
                title: "Careers",
                info: [
                    "LASOP boast of 99% job placement cohort on cohort from the very first batch. We have a special placement team that ensure that our graduands are well hired locally and internationally.",
                    "From banking to manufacturing and unto non-profit, our engineers have distinguished themselves as the true testament to our resilience and obsession for quality."
                ]
            }
        ]

    },
    {
        id: 3,
        dpt1: "Cyber Security",
        title: 'cybersecurity',
        dpt2: "security",
        bannerText: "Our cyber security course covers general introductory, operating systems, networking, cryptography, web security, compliance, forensic, and ETHICAL HACKING, and it's capped with project/course defence.",
        bannerBtn: [
            { text: "Ojodu-Berger" },
            { text: "Weekdays" },
            { text: "weekends" },
            { text: "4 months" },
        ],

        courseInfo: [
            {
                curr: "",
                text: ""
            },
            // {
            //     curr: "",
            //     text: ""
            // },
            // {
            //     curr: "",
            //     text: ""
            // },
            // {
            //     curr: "",
            //     text: ""
            // },
            // {
            //     curr: "",
            //     text: ""
            // },
            // {
            //     curr: "",
            //     text: ""
            // },

        ],
        packageBtn: [
            {
                title: "Entry Requirement",
                info: [
                    "Basic computer literacy such as ability to type texts on MS Word is encouraged but however, we take students of this course from the scratch or as they are to where they need to be.",
                    "Students should have a personal laptop computer. ",
                    "Students must be serious-minded and well behaved.",
                    "Laptop (Mac, Linux, PC) with minimum capacities of 4GB RAM and 250GB of storage capacity.",
                    "Tuition Fee"
                ]
            },
            {
                title: "Tuition Fee",
                info: ["N 400,000 for Nigerians", "50% More for foreign students"]
            },
            {
                title: "Lectures & Assesments",
                info: [
                    "Students should have a personal laptop computer. ",
                    "Tuition Fee"
                ]
            },
            {
                title: "Careers",
                info: [
                    "LASOP boast of 99% job placement cohort on cohort from the very first batch. We have a special placement team that ensure that our graduands are well hired locally and internationally.",
                    "From banking to manufacturing and unto non-profit, our engineers have distinguished themselves as the true testament to our resilience and obsession for quality."
                ]
            }
        ]

    },
    {
        id: 4,
        dpt1: "Mobile App",
        title: 'mobileapp',
        dpt2: "Development",
        bannerText: `In this program, you are going to have access to step-by-step classes with a qualified
        tutor, interactive coding exercises, quizzes, and much more! By the end of this course,
        you will be a full-fledged flutter developer, by mastering things like declarative
        Programming, animation, streams, features, etc. Companies like Google, Alibaba and
        their likes are already using flutter in their production apps so you are in the right space.`,
        bannerBtn: [
            { text: "Ojodu-Berger" },
            { text: "Weekdays" },
            { text: "weekends" },
            { text: "6 months" },
        ],

        courseInfo: [
            {
                curr: "Learn Flutter",
                text: "Flutter is use to build iOS apps, Android apps and even Web apps using one Programming Language, DART.So, instead of learning java or kotlin to build android apps and then learn swift or objective c to build iOS apps, you could do it all in one by just using flutter. Our curriculum covers all you need to become a flutter developer. Good news is, even if you are new to flutter or this is the first time of hearing about Mobile App, this course will take you from beginner’s level to becoming a skilled flutter developer. So, what are you waiting for?"
            },

        ],
        packageBtn: [
            {
                title: "Entry Requirement",
                info: [
                    "Basic computer literacy such as ability to type texts on MS Word is encouraged but however, we take students of this course from the scratch or as they are to where they need to be.",
                    "Students should have a personal laptop computer. ",
                    "Students must be serious-minded and well behaved.",
                    "Laptop (Mac, Linux, PC) with minimum capacities of 4GB RAM and 250GB of storage capacity.",
                    "Tuition Fee"
                ]
            },
            {
                title: "Tuition Fee",
                info: ["N 250,000 for Nigerians", "50% More for foreign students"]
            },
            {
                title: "Lectures & Assesments",
                info: [
                    "Students should have a personal laptop computer. ",
                    "Tuition Fee"
                ]
            },
            {
                title: "Careers",
                info: [
                    "LASOP boast of 99% job placement cohort on cohort from the very first batch. We have a special placement team that ensure that our graduands are well hired locally and internationally.",
                    "From banking to manufacturing and unto non-profit, our engineers have distinguished themselves as the true testament to our resilience and obsession for quality."
                ]
            }
        ]

    },
    {
        id: 5,
        dpt1: "Data Science And AI",
        title: 'datascience',
        dpt2: "Development",
        bannerText: "LASOP’s Data Science course can be considered an intermediate-level data science course, as it dives into prescriptive and predictive analysis, machine learning, artificial intelligence, statistical analysis, and programming languages.",
        bannerBtn: [
            { text: "Ojodu-Berger" },
            { text: "Weekdays" },
            { text: "weekends" },
            { text: "4 months" },
        ],

        courseInfo: [
            {
                curr: "Data Analysis And Foundation",
                text: "Launch your data analysis journey with an introduction to data by learning foundational concepts and new skills for approaching data problems. You'll start your learning journey by developing a problem-solving framework and by understanding how data should be collected and prepared for data analysis. Translate your learnings into job-ready skills by solving real-world problems with a variety of data sets.Learn Problem-Solving Strategies for High-Value Outputs Source High-Quality Data Master Excel Data Analysis"
            },
            {
                curr: "Python And Data Science Foundation",
                text: "Python programming and Data Science Foundations Python programming has emerged as an essential tool for data science. Launch into the course by learning the Python programming language, and use leading data science packages like NumPy and Pandas. With these tools in place, you’ll complete a variety of hands-on projects with code and learn to query data and perform data manipulation, building a strong foundation for what you’ll learn throughout the rest of the course. Explore Essential Data Science Tools Manage and Analyze Data"
            },
            {
                curr: "Database Operation And Advance D.A",
                text: "Go beyond the spreadsheet with relational databases. By learning how to use MySQL – an industry-standard tool used by companies like Tesla, Netflix, and more – you'll discover how databases are constructed and organized for data analysis. Learn how to write SQL queries through real-world projects to explore a database and perform more advanced operations and analysis.Learn Database Fundamentals Manage and Analyze Data with SQL Perform Advanced Data Analysis Organize and Optimize Data Sets"
            },
            {
                curr: "Data Cleaning And Visualization",
                text: "A Data Scientist requires great data to perform great data analysis. Learn data cleaning and data wrangling techniques to ensure your data is organized, structured, and consistent. Learn to translate your data into a compelling data visualization, and use Python packages to facilitate additional statistical analysis, so you can tell an effective story with your data and get the most out of your work. Create Data Visualizations Clean and Prepare Data"
            },
            {
                curr: "Communicating Data Insights",
                text: "Completing your data analysis is only the start. Continue your learning path by discovering how to present actionable insights effectively through data visualizations that inform business decisions created with Tableau, the world's leading business analysis platform. Go beyond simply presenting analysis results by learning best practices in storytelling with data and help drive effective decision-making informed by real data insights Highlight Critical Data Insights Build Impactful Visualizations & Dashboards Communicate Captivating Data Narratives"
            },
            {
                curr: "Statistics And Modelling",
                text: "Review important statistical analysis concepts and learn how they apply to data modeling and decision making. Using real data problems encountered in the data science field, learn to build both linear and categorical models, and understand when to use them. Practice applying these techniques to create models that help you make a predictive analysis. Learn Essential Statistical Analysis Concepts Define and Test Your Hypothesis Create Data Science Models"
            },
            {
                curr: "Data Science Portfolio Project",
                text: "Showcase everything you’ve learned with a unique portfolio project by completing a real-world analysis on a data set of your choosing. Every week in your Data Science class, you’ll be provided with clear steps to develop your final project. By the end of the course, you’ll have used programming to collect data and complete data wrangling, developed a hypothesis, and modeled your data to prove or disprove it. Finally, you’ll construct a data visualization to present your insights in a meaningful way."
            },
            {
                curr: "Intro To Machine Learning",
                text: "Machine learning has emerged as a truly disruptive technology and data science capability. Discover common machine learning techniques, and machine learning algorithms, and learn how they’re applied in practical, real-world scenarios. Explore the Fundamentals of Machine Learning Understand Machine Learning Models"
            },

        ],
        packageBtn: [
            {
                title: "Entry Requirement",
                info: [
                    "Basic computer literacy such as ability to type texts on MS Word is encouraged but however, we take students of this course from the scratch or as they are to where they need to be.",
                    "Students should have a personal laptop computer. ",
                    "Students must be serious-minded and well behaved.",
                    "Laptop (Mac, Linux, PC) with minimum capacities of 4GB RAM and 250GB of storage capacity.",
                    "Tuition Fee"
                ]
            },
            {
                title: "Tuition Fee",
                info: ["N400,000 for Nigerians", "50% More for foreign students"]
            },
            {
                title: "Lectures & Assesments",
                info: [
                    "Students should have a personal laptop computer. ",
                    "Tuition Fee"
                ]
            },
            {
                title: "Careers",
                info: [
                    "LASOP boast of 99% job placement cohort on cohort from the very first batch. We have a special placement team that ensure that our graduands are well hired locally and internationally.",
                    "From banking to manufacturing and unto non-profit, our engineers have distinguished themselves as the true testament to our resilience and obsession for quality."
                ]
            }
        ]

    },
    {
        id: 6,
        dpt1: "Data Analysis",
        title: 'dataanalysis',
        dpt2: "",
        bannerText: `Data Analysis involves the process of cleaning, changing, and processing raw
        data and extracting actionable & relevant information that helps businesses make
        informed decisions. The procedure helps reduce the risks inherent in decision-making
        by providing useful insights and statistics that is often presented in charts, images,
        tables, and graphs.`,
        bannerBtn: [
            { text: "Ojodu-Berger" },
            { text: "Weekdays" },
            { text: "weekends" },
            { text: "4 months" },
        ],

        courseInfo: [
            {
                curr: "Data Analysis And Foundation",
                text: "Launch your data analysis journey with an introduction to data by learning foundational concepts and new skills for approaching data problems. You'll start your learning journey by developing a problem-solving framework and by understanding how data should be collected and prepared for data analysis. Translate your learnings into job-ready skills by solving real-world problems with a variety of data sets.Learn Problem-Solving Strategies for High-Value Outputs Source High-Quality Data Master Excel Data Analysis"
            },
            // {curr: "Python And Data Science Foundation", text: "Python programming and Data Science Foundations Python programming has emerged as an essential tool for data science. Launch into the course by learning the Python programming language, and use leading data science packages like NumPy and Pandas. With these tools in place, you’ll complete a variety of hands-on projects with code and learn to query data and perform data manipulation, building a strong foundation for what you’ll learn throughout the rest of the course. Explore Essential Data Science Tools Manage and Analyze Data"},
            {
                curr: "Database Operation And Advance D.A",
                text: "Go beyond the spreadsheet with relational databases. By learning how to use MySQL – an industry-standard tool used by companies like Tesla, Netflix, and more – you'll discover how databases are constructed and organized for data analysis. Learn how to write SQL queries through real-world projects to explore a database and perform more advanced operations and analysis.Learn Database Fundamentals Manage and Analyze Data with SQL Perform Advanced Data Analysis Organize and Optimize Data Sets"
            },
            {
                curr: "Data Cleaning And Visualization",
                text: "A Data Scientist requires great data to perform great data analysis. Learn data cleaning and data wrangling techniques to ensure your data is organized, structured, and consistent. Learn to translate your data into a compelling data visualization, and use Python packages to facilitate additional statistical analysis, so you can tell an effective story with your data and get the most out of your work. Create Data Visualizations Clean and Prepare Data"
            },
            {
                curr: "Communicating Data Insights",
                text: "Completing your data analysis is only the start. Continue your learning path by discovering how to present actionable insights effectively through data visualizations that inform business decisions created with Tableau, the world's leading business analysis platform. Go beyond simply presenting analysis results by learning best practices in storytelling with data and help drive effective decision-making informed by real data insights Highlight Critical Data Insights Build Impactful Visualizations & Dashboards Communicate Captivating Data Narratives"
            },
            {
                curr: "Statistics And Modelling",
                text: "Review important statistical analysis concepts and learn how they apply to data modeling and decision making. Using real data problems encountered in the data science field, learn to build both linear and categorical models, and understand when to use them. Practice applying these techniques to create models that help you make a predictive analysis. Learn Essential Statistical Analysis Concepts Define and Test Your Hypothesis Create Data Science Models"
            },
            {
                curr: "Data Analysis Portfolio Project",
                text: "Showcase everything you’ve learned with a unique portfolio project by completing a real-world analysis on a data set of your choosing. Every week in your Data Science class, you’ll be provided with clear steps to develop your final project. By the end of the course, you’ll have used programming to collect data and complete data wrangling, developed a hypothesis, and modeled your data to prove or disprove it. Finally, you’ll construct a data visualization to present your insights in a meaningful way."
            },
            // {curr: "Intro To Machine Learning", text:"Machine learning has emerged as a truly disruptive technology and data science capability. Discover common machine learning techniques, and machine learning algorithms, and learn how they’re applied in practical, real-world scenarios. Explore the Fundamentals of Machine Learning Understand Machine Learning Models"},

        ],
        packageBtn: [
            {
                title: "Entry Requirement",
                info: [
                    "Basic computer literacy such as ability to type texts on MS Word is encouraged but however, we take students of this course from the scratch or as they are to where they need to be.",
                    "Students should have a personal laptop computer. ",
                    "Students must be serious-minded and well behaved.",
                    "Laptop (Mac, Linux, PC) with minimum capacities of 4GB RAM and 250GB of storage capacity.",
                    "Tuition Fee"
                ]
            },
            {
                title: "Tuition Fee",
                info: ["N 300,000 for Nigerians", "50% More for foreign students"]
            },
            {
                title: "Lectures & Assesments",
                info: [
                    "Students should have a personal laptop computer. ",
                    "Tuition Fee"
                ]
            },
            {
                title: "Careers",
                info: [
                    "LASOP boast of 99% job placement cohort on cohort from the very first batch. We have a special placement team that ensure that our graduands are well hired locally and internationally.",
                    "From banking to manufacturing and unto non-profit, our engineers have distinguished themselves as the true testament to our resilience and obsession for quality."
                ]
            }
        ]

    },
]

interface Team {
    id: number;
    img: any;
    role: string;
    name: string;
}

export const team: Team[] = [
    {
        id: 1,
        img: team1,
        role: 'CEO, LASOP',
        name: 'John Doe'
    },
    {
        id: 2,
        img: team2,
        role: 'CEO, LASOP',
        name: 'John Doe'
    },
    {
        id: 3,
        img: team3,
        role: 'CEO, LASOP',
        name: 'John Doe'
    },
    {
        id: 4,
        img: team4,
        role: 'CEO, LASOP',
        name: 'John Doe'
    },
    {
        id: 5,
        img: team5,
        role: 'CEO, LASOP',
        name: 'John Doe'
    },
    {
        id: 6,
        img: team6,
        role: 'CEO, LASOP',
        name: 'John Doe'
    },
]

interface Calendar {
    id: number;
    course: string;
    cohort: {
        days: string;
        code: string;
        start: string;
        end: string;
        link: string;
    }[]
}

export const calendar: Calendar[] = [
    {
        id: 1,
        course: 'Frontend',
        cohort: [
            {
                days: 'OGBA FEB WEEKDAYS',
                code: 'FEBOG1',
                start: 'FEB 21',
                end: 'JUL 14',
                link: 'https://frontend1.com',
            },
            {
                days: 'OGBA MAR WEEKENDS',
                code: 'MAROG1',
                start: 'MAR 01',
                end: 'AUG 10',
                link: 'https://frontend2.com',
            },
            {
                days: 'OGBA APR WEEKDAYS',
                code: 'APROG1',
                start: 'APR 05',
                end: 'SEP 20',
                link: 'https://frontend3.com',
            },
            {
                days: 'OGBA MAY WEEKENDS',
                code: 'MAYOG1',
                start: 'MAY 15',
                end: 'OCT 25',
                link: 'https://frontend4.com',
            },
            {
                days: 'OGBA JUN WEEKDAYS',
                code: 'JUNOG1',
                start: 'JUN 10',
                end: 'NOV 30',
                link: 'https://frontend5.com',
            },
            {
                days: 'OGBA JUL WEEKENDS',
                code: 'JULOG1',
                start: 'JUL 20',
                end: 'DEC 15',
                link: 'https://frontend6.com',
            }
        ]
    },
    {
        id: 2,
        course: 'Backend',
        cohort: [
            {
                days: 'OGBA FEB WEEKDAYS',
                code: 'FEBBK1',
                start: 'FEB 21',
                end: 'JUL 14',
                link: 'https://backend1.com',
            },
            {
                days: 'OGBA MAR WEEKENDS',
                code: 'MARBK1',
                start: 'MAR 01',
                end: 'AUG 10',
                link: 'https://backend2.com',
            },
            {
                days: 'OGBA APR WEEKDAYS',
                code: 'APRBK1',
                start: 'APR 05',
                end: 'SEP 20',
                link: 'https://backend3.com',
            },
            {
                days: 'OGBA MAY WEEKENDS',
                code: 'MAYBK1',
                start: 'MAY 15',
                end: 'OCT 25',
                link: 'https://backend4.com',
            },
            {
                days: 'OGBA JUN WEEKDAYS',
                code: 'JUNBK1',
                start: 'JUN 10',
                end: 'NOV 30',
                link: 'https://backend5.com',
            },
            {
                days: 'OGBA JUL WEEKENDS',
                code: 'JULBK1',
                start: 'JUL 20',
                end: 'DEC 15',
                link: 'https://backend6.com',
            }
        ]
    },
    {
        id: 3,
        course: 'Fullstack',
        cohort: [
            {
                days: 'OGBA FEB WEEKDAYS',
                code: 'FEBFS1',
                start: 'FEB 21',
                end: 'JUL 14',
                link: 'https://fullstack1.com',
            },
            {
                days: 'OGBA MAR WEEKENDS',
                code: 'MARFS1',
                start: 'MAR 01',
                end: 'AUG 10',
                link: 'https://fullstack2.com',
            },
            {
                days: 'OGBA APR WEEKDAYS',
                code: 'APRFS1',
                start: 'APR 05',
                end: 'SEP 20',
                link: 'https://fullstack3.com',
            },
            {
                days: 'OGBA MAY WEEKENDS',
                code: 'MAYFS1',
                start: 'MAY 15',
                end: 'OCT 25',
                link: 'https://fullstack4.com',
            },
            {
                days: 'OGBA JUN WEEKDAYS',
                code: 'JUNFS1',
                start: 'JUN 10',
                end: 'NOV 30',
                link: 'https://fullstack5.com',
            },
            {
                days: 'OGBA JUL WEEKENDS',
                code: 'JULFS1',
                start: 'JUL 20',
                end: 'DEC 15',
                link: 'https://fullstack6.com',
            }
        ]
    },
    {
        id: 4,
        course: 'UI / UX',
        cohort: [
            {
                days: 'OGBA FEB WEEKDAYS',
                code: 'FEBUI1',
                start: 'FEB 21',
                end: 'JUL 14',
                link: 'https://uiux1.com',
            },
            {
                days: 'OGBA MAR WEEKENDS',
                code: 'MARUI1',
                start: 'MAR 01',
                end: 'AUG 10',
                link: 'https://uiux2.com',
            },
            {
                days: 'OGBA APR WEEKDAYS',
                code: 'APRUI1',
                start: 'APR 05',
                end: 'SEP 20',
                link: 'https://uiux3.com',
            },
            {
                days: 'OGBA MAY WEEKENDS',
                code: 'MAYUI1',
                start: 'MAY 15',
                end: 'OCT 25',
                link: 'https://uiux4.com',
            },
            {
                days: 'OGBA JUN WEEKDAYS',
                code: 'JUNUI1',
                start: 'JUN 10',
                end: 'NOV 30',
                link: 'https://uiux5.com',
            },
            {
                days: 'OGBA JUL WEEKENDS',
                code: 'JULUI1',
                start: 'JUL 20',
                end: 'DEC 15',
                link: 'https://uiux6.com',
            }
        ]
    },
    {
        id: 5,
        course: 'App Dev',
        cohort: [
            {
                days: 'OGBA FEB WEEKDAYS',
                code: 'FEBAD1',
                start: 'FEB 21',
                end: 'JUL 14',
                link: 'https://appdev1.com',
            },
            {
                days: 'OGBA MAR WEEKENDS',
                code: 'MARAD1',
                start: 'MAR 01',
                end: 'AUG 10',
                link: 'https://appdev2.com',
            },
            {
                days: 'OGBA APR WEEKDAYS',
                code: 'APRAD1',
                start: 'APR 05',
                end: 'SEP 20',
                link: 'https://appdev3.com',
            },
            {
                days: 'OGBA MAY WEEKENDS',
                code: 'MAYAD1',
                start: 'MAY 15',
                end: 'OCT 25',
                link: 'https://appdev4.com',
            },
            {
                days: 'OGBA JUN WEEKDAYS',
                code: 'JUNAD1',
                start: 'JUN 10',
                end: 'NOV 30',
                link: 'https://appdev5.com',
            },
            {
                days: 'OGBA JUL WEEKENDS',
                code: 'JULAD1',
                start: 'JUL 20',
                end: 'DEC 15',
                link: 'https://appdev6.com',
            }
        ]
    },
    {
        id: 6,
        course: 'Data & AI',
        cohort: [
            {
                days: 'OGBA FEB WEEKDAYS',
                code: 'FEBDA1',
                start: 'FEB 21',
                end: 'JUL 14',
                link: 'https://dataai1.com',
            },
            {
                days: 'OGBA MAR WEEKENDS',
                code: 'MARDA1',
                start: 'MAR 01',
                end: 'AUG 10',
                link: 'https://dataai2.com',
            },
            {
                days: 'OGBA APR WEEKDAYS',
                code: 'APRDA1',
                start: 'APR 05',
                end: 'SEP 20',
                link: 'https://dataai3.com',
            },
            {
                days: 'OGBA MAY WEEKENDS',
                code: 'MAYDA1',
                start: 'MAY 15',
                end: 'OCT 25',
                link: 'https://dataai4.com',
            },
            {
                days: 'OGBA JUN WEEKDAYS',
                code: 'JUNDA1',
                start: 'JUN 10',
                end: 'NOV 30',
                link: 'https://dataai5.com',
            },
            {
                days: 'OGBA JUL WEEKENDS',
                code: 'JULDA1',
                start: 'JUL 20',
                end: 'DEC 15',
                link: 'https://dataai6.com',
            }
        ]
    },
];

interface TermsAndConditions {
    title: string;
    sections: Section[];
}

interface Section {
    title: string;
    content?: string;
    listType?: "number" | "circle";
    items?: string[];
}

export const termsAndConditions: TermsAndConditions[] = [
    {
        title: "ADMISSION AND STUDY TERMS AND CONDITIONS",
        sections: [
            {
                title: "PREAMBLE",
                content: `
          These are the valid rules binding the persons or person that signs it, so that he or she becomes a trainee, at any centre of Lagos school of Programming Limited, otherwise known as “LASOP” and LASOP and its assigns. The parties; “student” and “LASOP” therefore covenant’s as follows:`
            },
            {
                title: "ENROLMENT",
                listType: "number",
                items: [
                    "When a person pays any fee to LASOP or and attends any class, organized by LASOP, it means that the candidate has acknowledged and accepted and therefore signed this terms and conditions.",
                    "LASOP is obligated then after, to teach the student the course he or she is enrolled in, using one or more of her assigned tutors. LASOP ensures that all the course units and syllabus that the student should learn is fully covered, either within the time allotted for the course to be completed or at most, by the end of an extra month.",
                    "The student is to come to classes with one personal computer, its charger and a bag for carrying the computer and its accessories. The bag can contain books related to the student’s course of study and writing materials. The Student can come with food or water but he or she is to keep them safely under their tables or in lockers if provided. The student is not allowed to come with any other thing, harmful or harmless."
                ]
            },
            {
                title: "PAYMENTS",
                listType: "circle",
                items: [
                    "Payment of course fees must be made in full before the first day of class. Should the school allow the student to pay his or her fees in installments, the student must complete the payment by the due date as communicated to him or her during enrolment.",
                    "Course fee is nonrefundable.",
                    "When LASOP fails to begin a course after one month of when it should begin or, when an active course stops abruptly and LASOP fails to continue the course after one month, fees paid must be refunded to the students affected. The fees refundable is based on the number of days not covered and not on what has been taught. The finance office shall prorate and decide the amount refundable to each concerned, payments of the refunds shall be made, excluding the general registration fees for each course which is usually 20% of the total amount the course cost.",
                    "Payments of course fees can be paid online through the official website or in cash, or as a bank deposit and the payment must be made only to the schools official bank account. LASOP shall not recognize any fee paid to unofficial bank accounts.",
                    "Payment of course fee in Installments is considered by management at discretion and not automatic. Where applicable, only two installments shall be permitted and the minimum amount allowed for the first installment is 70% of the total fee and the balance must be paid within one month from the start of the course enrolled for or should be paid just as described in the previous article, numbered 1.",
                    "The management shall withdraw without readmission, any student who fails to meet up with payment plans permitted. A thorough breakdown of the installments plan is given on the installments contracts and all students paying their fees in installments must read and sign it. It is noteworthy to mark that not reading nor signing the FEES BY INSTALLMENT document does not exempt any student who falls into the fees by installment category from being liable to the contract. They are automatically liable the moment they decide to pay their fees in installment."
                ]
            },
            {
                title: "ATTENDING CLASSES",
                listType: "number",
                items: [
                    "Students must be punctual and serious minded. When a student is absent, or found to be fond of coming late to classes, even up to 50% by mid-course, the student shall be withdrawn from the school and shall not be readmitted.",
                    "Students must dress decently to be admitted into the classroom.",
                    "Weekdays classes begin at 9:00am and end at 6:00pm daily, and it occurs only three days between Mondays to Fridays.",
                    "Weekend classes are from 09:00am on Saturdays and 11am on Sundays.",
                    "Management, in collaboration with tutors can however decide timing adjustments in favor of the student from time to time especially for flexibility.",
                    `PLEASE NOTE THAT a student can be in the morning or afternoon set at a stage in the course and that the set a student shall be in is entirely decided by LASOP. Morning set starts their classes at 9:00am and closes at 2:00pm while the afternoon set starts their classes by 2:00pm and closes by 6:00pm. However, students should prepare to be engaged from morning to evening on any of the days their class falls in.`,
                    `Take note: 
            No phone calls in the classroom.
            Respect, listen and pay keen attention during classes. Do not disturb others.
            Always ask questions when you don’t understand.
            Eating in the classroom is prohibited.`,
                    "Unhealthy use of technology, the internet and computers in and around the school premise, whether or not they belong to the student is prohibited."
                ]
            },
            {
                title: "SCHOOL EQUIPMENTS, FACILITIES & ACTIVITIES",
                listType: "number",
                items: [
                    "Students are to make good use of the facilities/equipment of the school and should not destroy or take away any property. The student is liable to pay for any equipment or facility destroyed.",
                    "It is the responsibility of the student to keep the classroom clean.",
                    "The publication of printed and electronic materials that features students class work photographs, designs and videos for online and offline promotion of the student and of LASOP is a consensual, collective responsibility."
                ]
            },
            {
                title: "COURSE CERTIFICATE",
                listType: "number",
                items: [
                    "Students will be awarded course certificates at the end of the course. They will be denied the certificate if they fail to complete an overall of 50% attendance.",
                    "Students can download course certificates from the schools website with their student ID once they graduate."
                ]
            }
        ]
    }
];

interface CoursePrice {
    title: string;
    fee: string;
}

export const coursePrice: CoursePrice[] = [
    {
        title: 'Product Design',
        fee: '250,000'
    },
    {
        title: 'Frontend',
        fee: '300,000'
    },
    {
        title: 'Backend',
        fee: '250,000'
    },
    {
        title: 'Fullstack',
        fee: '400,000'
    },
    {
        title: 'Mobile app',
        fee: '250,000'
    },
    {
        title: 'Data Science and AI',
        fee: '400,000'
    },
    {
        title: 'Data Analysis',
        fee: '300,000'
    },
];

export const mode: string[] = [
    'Online',
    'Weekend',
    'Weekday'
]

export const centers: string[] = [
    'Ogba',
    'Lekki',
    'Berger'
]

interface Colleagues {
    id: number;
    title: string;
    numCol: number;
    icon: any;
}

export const colleague: Colleagues[] = [
    {
        id: 1,
        title: 'No of students',
        numCol: 120,
        icon: student
    },
    {
        id: 2,
        title: 'No of staffs',
        numCol: 24,
        icon: staff
    },
    {
        id: 3,
        title: 'No of centers',
        numCol: 3,
        icon: center
    },
    {
        id: 4,
        title: 'Courses',
        numCol: 12,
        icon: courses
    },
    {
        id: 5,
        title: 'Current cohorts',
        numCol: 8,
        icon: cohort
    },
    {
        id: 6,
        title: 'Completed cohorts',
        numCol: 18,
        icon: complete
    },
    {
        id: 7,
        title: 'New applicants',
        numCol: 64,
        icon: newApp
    },
    {
        id: 8,
        title: 'Graduates',
        numCol: 97,
        icon: graduate
    }
];

export const staffOver: Colleagues[] = [
    {
        id: 1,
        title: 'No of students',
        numCol: 120,
        icon: student
    },
    {
        id: 2,
        title: 'Current cohorts',
        numCol: 24,
        icon: staff
    },
    {
        id: 3,
        title: 'Graduates',
        numCol: 3,
        icon: graduate
    },
    {
        id: 4,
        title: 'Completed cohorts',
        numCol: 18,
        icon: complete
    },
];
