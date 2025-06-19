import charlesGuoImage from '/assets/images/user-avatars/charles-guo.png';
import raghavDuaImage from '/assets/images/user-avatars/raghav-dua.jpg';
import djordeLukicImage from '/assets/images/user-avatars/djorde-lukic.jpg';
import rahulTarakImage from '/assets/images/user-avatars/rahul-tarak.jpg';
import pranjalPaliwalImage from '/assets/images/user-avatars/pranjal-paliwal.jpg';
import kangmingImage from '/assets/images/user-avatars/kangming.jpg';
import ananthalakshmiSankarImage from '/assets/images/user-avatars/ananthalakshmi-sankar.jpg';
import beyangLiuImage from '/assets/images/user-avatars/beyang-liu.jpg';
import akshataMohanImage from '/assets/images/user-avatars/akshata-mohan.jpg';
import jonathanImage from '/assets/images/user-avatars/jonathan.jpg';
import patrickBurrisImage from '/assets/images/user-avatars/patrick-burris.jpg';
import cindyWuImage from '/assets/images/user-avatars/cindy-wu.jpg';
import vladislavTenImage from '/assets/images/user-avatars/vladislav-ten.jpeg';
import appleImage from '/assets/images/company-logos/apple-company-logo.svg';
import bookingImage from '/assets/images/company-logos/bookingcom-company-logo.svg';
import sourcegraphImage from '/assets/images/company-logos/sourcegraph-company-logo.svg';
import stripeImage from '/assets/images/company-logos/stripe-company-logo.svg';
import jakubgradckiImage from '/assets/images/user-avatars/jakub-gradcki.jpeg';
import hcltechImage from '/assets/images/company-logos/hcltech-company-logo.svg';
import connormurphyImage from '/assets/images/user-avatars/connor-murphy.jpeg';
import walmartglobaltechImage from '/assets/images/company-logos/walmart-global-tech-company-logo-2.svg';
import krishnavImage from '/assets/images/user-avatars/krishna-vaidyanathan.jpeg';
import googleImage from '/assets/images/company-logos/google-company-logo.svg';
import joeypereiraImage from '/assets/images/user-avatars/joey-pereira.jpeg';
import openaiImage from '/assets/images/company-logos/openai-company-logo.svg';
import albertsalimImage from '/assets/images/user-avatars/albert-salim.jpeg';
import gitlabImage from '/assets/images/company-logos/gitlab-company-logo.svg';

interface Testimonial {
  authorName: string;
  authorDesignation: string;
  authorAvatarImage: string;
  authorCompanyLogo?: string;
  text: string;
}

const testimonials: Record<string, Testimonial> = {
  'charles-guo': {
    authorName: 'Charles Guo',
    authorCompanyLogo: stripeImage,
    authorDesignation: 'Scala Team at Stripe',
    authorAvatarImage: charlesGuoImage,
    text: `The Redis challenge was extremely fun. I ended up having to read Redis protocol specification doc pretty carefully in its entirety! The result felt like lightly-guided independent study, if that makes sense. (Which, again, was lots of fun)`,
  },
  'raghav-dua': {
    authorName: 'Raghav Dua',
    authorDesignation: 'SRE at Booking.com',
    authorCompanyLogo: bookingImage,
    authorAvatarImage: raghavDuaImage,
    text: `I spent a full day on your Docker building course and ended up building the whole thing myself. As a SRE (and mostly a user of docker), digging into the internals blew me away.`,
  },
  'djordje-lukic': {
    authorName: 'Djordje Lukic (@rumpl)',
    authorDesignation: 'Full-time Docker contributor',
    authorAvatarImage: djordeLukicImage,
    text: `These guys ruined my weekend`,
  },

  'rahul-tarak': {
    authorName: 'Rahul Tarak',
    authorDesignation: 'Pioneer.app & ODX1 Fellow',
    authorAvatarImage: rahulTarakImage,
    text: "The Redis challenge was a great way to procrastinate sleeping for a week! A good change of pace from my regular work, and allowed me to explore some cool tech. I'll be back for more.",
  },

  'pranjal-paliwal': {
    authorName: 'Pranjal Paliwal',
    authorDesignation: '$35k winner of HackAtom',
    authorAvatarImage: pranjalPaliwalImage,
    text: 'My favorite way to master a language.',
  },

  'kang-ming-tay': {
    authorName: 'Kang Ming Tay',
    authorDesignation: 'Software Engineer at Supabase',
    authorAvatarImage: kangmingImage,
    text: 'The Docker challenge helped me dive into its internals, through *actual* practice. Super fun.',
  },

  'ananthalakshmi-sankar': {
    authorName: 'Ananthalakshmi Sankar',
    authorDesignation: 'Automation Engineer at Apple',
    authorCompanyLogo: appleImage,
    authorAvatarImage: ananthalakshmiSankarImage,
    text: "There are few sites I like as much that have a step by step guide. The real-time feedback is so good, it's creepy!",
  },

  'beyang-liu': {
    authorName: 'Beyang Liu',
    authorDesignation: 'CTO at SourceGraph',
    authorAvatarImage: beyangLiuImage,
    authorCompanyLogo: sourcegraphImage,
    text: 'Found out from a colleague. It has you build your own version of things like Git and Docker from scratch. A cool way to build a stronger mental model of how those tools work.',
  },

  'akshata-mohan': {
    authorName: 'Akshata Mohan',
    authorDesignation: 'Senior Data Scientist at Cloudflare',
    authorAvatarImage: akshataMohanImage,
    text: "I'm learning about how Redis works under the hood, system calls, socket programming in Python — something I've never done before",
  },

  'jonathan-lorimer': {
    authorName: 'Jonathan Lorimer',
    authorDesignation: 'Lead SWE at Mercury Bank',
    authorAvatarImage: jonathanImage,
    text: `I was really impressed that they support Haskell, and will probably use this to learn Rust! The git-based workflow is :chefkiss:`,
  },

  'patrick-burris': {
    authorName: 'Patrick Burris',
    authorDesignation: 'Senior Software Developer at CenturyLink',
    authorAvatarImage: patrickBurrisImage,
    text: "The instant feedback right there in the git push is really cool. Didn't even know that was possible!",
  },

  'cindy-wu': {
    authorName: 'Cindy Wu',
    authorDesignation: 'Participant at Recurse Center',
    authorAvatarImage: cindyWuImage,
    text: "I've started the SQLite challenge, enjoying it a lot so far. Just the right level of guidance, helpful yet gives you a lot of freedom to explore and learn for yourself.",
  },

  'vladislav-ten': {
    authorName: 'Vladislav Ten',
    authorDesignation: 'Software Engineer at Microsoft',
    authorAvatarImage: vladislavTenImage,
    text: 'In a perfect world, job interviews ask for assignments like CodeCrafters instead of Leetcode. The best way to refresh your programming language skills and learn something new about Redis, Git, SQLite internals.',
  },
  'jakub-gradcki': {
    authorName: 'Jakub Grądcki',
    authorDesignation: 'Senior Architect at HCLTech',
    authorAvatarImage: jakubgradckiImage,
    authorCompanyLogo: hcltechImage,
    text: "I love that I don't have to do the tedious work at the start of the project. I can jump in and start building right away.",
  },
  'connor-murphy': {
    authorName: 'Connor Murphy',
    authorDesignation: 'Senior SWE at Walmart Global Tech',
    authorAvatarImage: connormurphyImage,
    authorCompanyLogo: walmartglobaltechImage,
    text: "How does a senior dev continue to get better? CodeCrafters helps me practice out of my comfort zone.",
  },
  'krishna-vaidyanathan': {
    authorName: 'Krishna Vaidyanathan',
    authorDesignation: 'Software Engineer III at Google',
    authorAvatarImage: krishnavImage,
    authorCompanyLogo: googleImage,
    text: "CodeCrafters helps with practical learning which is crucial for SWE interviews.",
  },
  'joey-pereira': {
    authorName: 'Joey Pereira',
    authorDesignation: 'Software Engineer at OpenAI',
    authorAvatarImage: joeypereiraImage,
    authorCompanyLogo: openaiImage,
    text: "This idea is absolutely stellar. Having a structured project like this feels like a blast.",
  },
  'albert-salim': {
    authorName: 'Albert Salim',
    authorDesignation: 'Senior Backend Engineer at GitLab',
    authorAvatarImage: albertsalimImage,
    authorCompanyLogo: gitlabImage,
    text: "I'd recommend CodeCrafters to every curious developer who wants to really understand the tools they use every day.",
  },
};

export default testimonials;
export type { Testimonial };
