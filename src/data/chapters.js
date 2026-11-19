// Local question bank for CIS 3010-16.
// Questions, explanations and slide references are carried over unchanged from the v1 prototype.
// `topics[key].practice` holds fresh follow-up questions used only for targeted practice.
// Follow-ups are original sample wording and intentionally carry no slide reference.

export const COURSE = { code: 'CIS 3010-16' };

export const CHAPTERS = [
  {
    number: 1,
    title: 'The Importance of MIS',
    art: 'chip',
    topics: {
      tech: { name: 'Technology and digital change', slides: [9] },
      skills: {
        name: 'Skills and careers',
        slides: [15, 19],
        practice: [
          {
            q: 'Your project team keeps disagreeing about the approach. Giving and receiving critical feedback to reach a better result is which skill?',
            choices: ['Abstract reasoning', 'Collaboration', 'Ability to experiment', 'Systems thinking'],
            answer: 1,
            why: 'Collaboration is people working toward a shared goal, and that includes giving and accepting critical feedback.'
          },
          {
            q: 'Building a simplified model of a business problem that keeps the key elements and leaves out the noise is called…',
            choices: ['Systems thinking', 'Ability to experiment', 'Abstract reasoning', 'Collaboration'],
            answer: 2,
            why: 'Abstract reasoning is the ability to make and manipulate models. Systems thinking goes further and models how the parts interact.'
          }
        ]
      },
      is: { name: 'Information systems', slides: [31, 38, 39] },
      data: { name: 'Data and information quality', review: 'Reread how data differs from information.' }
    },
    questions: [
      { topic: 'tech', q: 'The “point” of Moore’s Law is to…', choices: ['predict that computers will keep getting larger', 'understand that processing costs are rising', 'recognize that the cost of data processing is approaching zero', 'measure how quickly networks grow'], answer: 2,
        why: 'Processing power keeps doubling, so the cost of processing data keeps falling toward zero.', slides: 'Slide 9' },
      { topic: 'skills', q: 'In a job interview, Roy is asked to use a product he has never used before. Which skill is the interviewer testing?', choices: ['Abstract reasoning', 'Collaboration', 'Ability to experiment', 'Systems thinking'], answer: 2,
        why: 'Working out an unfamiliar product on the spot is the ability to experiment.', slides: 'Slides 15, 19' },
      { topic: 'skills', q: 'Modeling how a system’s parts connect, and predicting what changes when one part changes, is called…', choices: ['Abstract reasoning', 'Collaboration', 'Ability to experiment', 'Systems thinking'], answer: 3,
        why: 'Systems thinking means modeling the components of a system and how they affect each other.', slides: 'Slide 15' },
      { topic: 'is', q: 'Which is a critical responsibility of business professionals who use information systems?', choices: ['Protecting the security of the system and its data', 'Reprogramming the system to meet changing needs', 'Replacing the system’s hardware', 'Writing the system’s database code'], answer: 0,
        why: 'Users are responsible for protecting access to the system and backing up their data.', slides: 'Slides 31, 38, 39' },
      { topic: 'data', q: '________ is defined as recorded facts or figures.', choices: ['Information', 'Procedures', 'Software', 'Data'], answer: 3,
        why: 'Data is recorded facts or figures. Information is what people conceive from that data.' }
    ]
  },
  {
    number: 2,
    title: 'Organizational Strategy, Information Systems, and Competitive Advantage',
    art: 'forces',
    topics: {
      industry: { name: 'Industry structure', review: 'Reread the section on Porter’s five forces model.' },
      strategy: { name: 'Competitive strategy', review: 'Reread the four competitive strategies: cost or differentiation, industry-wide or focused.' },
      value: { name: 'Value chains', review: 'Reread how primary and support activities differ in the value chain.' }
    },
    questions: [
      { topic: 'industry', q: 'Porter’s five forces model is used to assess…', choices: ['an employee’s performance', 'an industry’s structure and profitability', 'a company’s IT budget', 'a product’s life cycle'], answer: 1,
        why: 'The five forces describe how attractive and profitable an industry is.' },
      { topic: 'industry', q: 'Which of these is one of Porter’s five forces?', choices: ['Employee turnover', 'Interest rates', 'Threat of substitute products', 'Brand awareness'], answer: 2,
        why: 'Substitutes are one force, along with new entrants, buyer power, supplier power and rivalry.' },
      { topic: 'strategy', q: 'A retailer that offers the lowest prices across its entire industry is using…', choices: ['focused differentiation', 'industry-wide differentiation', 'focused cost leadership', 'industry-wide cost leadership'], answer: 3,
        why: 'Lowest prices across the whole market is industry-wide cost leadership.' },
      { topic: 'value', q: 'Which is a primary activity in Porter’s value chain?', choices: ['Human resources', 'Outbound logistics', 'Technology development', 'Firm infrastructure'], answer: 1,
        why: 'Outbound logistics is a primary activity. The other three are support activities.' },
      { topic: 'strategy', q: 'Making it costly for customers to move to a competitor is called…', choices: ['creating high switching costs', 'differentiating the product', 'forming an alliance', 'reducing costs'], answer: 0,
        why: 'High switching costs lock customers in and protect against rivals.' }
    ]
  },
  {
    number: 3,
    title: 'Business Intelligence Systems',
    art: 'chart',
    topics: {
      process: { name: 'The BI process', review: 'Reread the three BI activities: acquire data, perform analysis, publish results.' },
      warehouse: { name: 'Data warehouses and marts', review: 'Reread how a data warehouse differs from a data mart.' },
      analysis: { name: 'Analysis techniques', review: 'Reread the examples of RFM and market-basket analysis.' }
    },
    questions: [
      { topic: 'process', q: 'What are the three primary activities in the business intelligence process?', choices: ['Collect, store, delete', 'Acquire data, perform analysis, publish results', 'Plan, build, test', 'Input, process, output'], answer: 1,
        why: 'BI systems acquire data, analyze it, and publish the results to the people who need them.' },
      { topic: 'warehouse', q: 'The main job of a data warehouse is to…', choices: ['process daily sales transactions', 'host the company website', 'gather and clean data from many sources for analysis', 'back up employee email'], answer: 2,
        why: 'A data warehouse pulls data from many sources, cleans it, and stores it for BI analysis.' },
      { topic: 'warehouse', q: 'A data mart is…', choices: ['a smaller collection of data for one business function', 'an online store for buying data', 'a larger copy of the data warehouse', 'a spreadsheet of customer names'], answer: 0,
        why: 'A data mart holds a subset of warehouse data prepared for a specific function, like marketing.' },
      { topic: 'analysis', q: 'RFM analysis ranks customers by…', choices: ['region, field, and market', 'returns, feedback, and mentions', 'revenue, forecasts, and margins', 'recency, frequency, and money spent'], answer: 3,
        why: 'RFM scores how recently, how often, and how much each customer buys.' },
      { topic: 'analysis', q: 'Market-basket analysis is used to find…', choices: ['the cheapest supplier', 'products customers tend to buy together', 'the busiest store hours', 'which employees sell the most'], answer: 1,
        why: 'It reveals items that are often purchased together, which supports cross-selling.' }
    ]
  }
];
