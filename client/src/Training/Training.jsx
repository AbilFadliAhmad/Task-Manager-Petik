import React, { useEffect, useState } from 'react';

const InfiniteScrollComponent = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`);
      const newItems = await response.json();
      if (newItems.length > 0) {
        setItems((prevItems) => [...prevItems, ...newItems]);
      } else {
        setHasMore(false); // Hentikan fetching jika tidak ada data lagi
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(page);
  }, [page]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1 && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Clean up listener saat komponen unmount
  }, [loading, hasMore]);

  return (
    <div>
      <h1>Infinite Scroll Example</h1>
      {items.map((item, index) => (
        <div key={index}>
          <h2>{item.title}</h2>
          <p>{item.body}</p>
        </div>
      ))}
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more data to load.</p>}
    </div>
  );
};

export default InfiniteScrollComponent;