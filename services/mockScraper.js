export default async function mockScraper({ company, companyUrl, startDate, endDate, source }) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate realistic mock data based on company and source
  const generateMockReviews = () => {
    const baseReviews = [
      {
        title: `Excellent ${company} for our team workflow`,
        review: `We've been using ${company} for over a year and it has significantly improved our team collaboration. The interface is intuitive and the customer support is responsive. Would highly recommend to other teams.`,
        date: "2024-06-15T00:00:00.000Z",
        rating: 4.5,
        reviewer: "John Doe",
        source: source,
        url: companyUrl || `https://www.${source}.com/products/${company.toLowerCase()}/reviews`
      },
      {
        title: `Solid solution with great features`,
        review: `${company} offers all the features we need at a reasonable price. The integration with other tools was seamless and our team adapted quickly. The mobile app is particularly well-designed.`,
        date: "2024-03-20T00:00:00.000Z",
        rating: 4.0,
        reviewer: "Sarah Wilson",
        source: source,
        url: companyUrl || `https://www.${source}.com/products/${company.toLowerCase()}/reviews`
      },
      {
        title: `Good but has some limitations`,
        review: `Overall ${company} is good for basic use cases. However, we encountered some limitations with advanced reporting features. Hope they improve this in future updates. Customer support was helpful though.`,
        date: "2024-01-10T00:00:00.000Z",
        rating: 3.5,
        reviewer: "Mike Johnson",
        source: source,
        url: companyUrl || `https://www.${source}.com/products/${company.toLowerCase()}/reviews`
      },
      {
        title: `Best in class ${company} solution`,
        review: `After trying several alternatives, ${company} stands out for its reliability and comprehensive feature set. The mobile app works flawlessly and the uptime has been perfect.`,
        date: "2024-08-05T00:00:00.000Z",
        rating: 5.0,
        reviewer: "Emily Chen",
        source: source,
        url: companyUrl || `https://www.${source}.com/products/${company.toLowerCase()}/reviews`
      },
      {
        title: `Decent product with room for improvement`,
        review: `${company} gets the job done but the learning curve was steeper than expected. The documentation could be more comprehensive. Once you get past the initial setup, it works reasonably well.`,
        date: "2024-04-18T00:00:00.000Z",
        rating: 3.0,
        reviewer: "David Brown",
        source: source,
        url: companyUrl || `https://www.${source}.com/products/${company.toLowerCase()}/reviews`
      },
      {
        title: `Revolutionized our workflow`,
        review: `${company} has completely transformed how our team works together. The automation features saved us countless hours and the analytics provide valuable insights.`,
        date: "2024-07-22T00:00:00.000Z",
        rating: 4.8,
        reviewer: "Alex Garcia",
        source: source,
        url: companyUrl || `https://www.${source}.com/products/${company.toLowerCase()}/reviews`
      },
      {
        title: `Good value for money`,
        review: `For the price, ${company} offers excellent value. It may not have all the bells and whistles of more expensive alternatives, but it covers all the essentials very well.`,
        date: "2024-02-14T00:00:00.000Z",
        rating: 4.2,
        reviewer: "Lisa Thompson",
        source: source,
        url: companyUrl || `https://www.${source}.com/products/${company.toLowerCase()}/reviews`
      }
    ];

    // Shuffle and return 3-6 random reviews to simulate variability
    const shuffled = baseReviews.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3 + Math.floor(Math.random() * 3));
  };

  const mockReviews = generateMockReviews();

  // Filter by date range if provided
  const filteredReviews = mockReviews.filter(review => {
    const reviewDate = new Date(review.date);
    const start = startDate ? new Date(startDate) : new Date('2000-01-01');
    const end = endDate ? new Date(endDate) : new Date('2030-12-31');
    
    return reviewDate >= start && reviewDate <= end;
  });

  return filteredReviews;
}