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

const testimonials = {
  'charles-guo': {
    authorName: 'Charles Guo',
    authorDesignation: 'Scala Team at Stripe',
    authorAvatarImage: charlesGuoImage,
    text: `The Redis challenge was extremely fun. I ended up having to read Redis protocol specification doc pretty carefully in its entirety! The result felt like lightly-guided independent study, if that makes sense. (Which, again, was lots of fun)`,
  },
  'raghav-dua': {
    authorName: 'Raghav Dua',
    authorDesignation: 'SRE at Coinbase',
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
    authorAvatarImage: ananthalakshmiSankarImage,
    text: "There are few sites I like as much that have a step by step guide. The real-time feedback is so good, it's creepy!",
  },

  'beyang-liu': {
    authorName: 'Beyang Liu',
    authorDesignation: 'CTO at SourceGraph',
    authorAvatarImage: beyangLiuImage,
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
    text: `I was really impressed that they support Haskell, and will probably usethis to learn Rust! The git-based workflow is :chefkiss:`,
  },

  'patrick-burris': {
    authorName: 'Patrick Burris',
    authorDesignation: 'Senior Software Developer at CenturyLink',
    authorAvatarImage: patrickBurrisImage,
    text: "The instant feedback right there in the git push is really cool. Didn't even know that was possible!",
  },
};

export default testimonials;
