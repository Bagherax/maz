import React from 'react';
import { useView } from '../../../../App';

// Props are simplified as the filter and category buttons are removed in the new design.
interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onQueryChange }) => {
  const { setView } = useView();

  // User-provided CSS, adapted with specific class names and dark mode support.
  const searchCSS = `
    .search-input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      border: none;
      outline: none;
      padding: 18px 16px;
      background-color: transparent;
      cursor: pointer;
      transition: all .5s ease-in-out;
    }

    .search-input::placeholder {
      color: transparent;
    }

    .search-input:focus::placeholder {
      color: rgb(131, 128, 128);
    }

    .search-input:focus,
    .search-input:not([value=""]) {
      background-color: #fff;
      border: 1px solid rgb(91, 107, 255);
      width: 290px;
      cursor: text;
      padding: 18px 16px 18px 45px;
    }
    
    .dark .search-input:focus,
    .dark .search-input:not([value=""]) {
        background-color: #1F2937; /* gray-800 */
        color: #F3F4F6; /* gray-100 */
        border-color: rgb(129, 140, 248); /* indigo-400 */
    }
    .dark .search-input:focus::placeholder {
        color: #9CA3AF; /* gray-400 */
    }


    .search-icon {
      position: absolute;
      left: 0;
      top: -2.5px; /* Centering adjustment */
      height: 45px;
      width: 45px;
      background-color: #fff;
      border-radius: 99px;
      z-index: -1;
      fill: rgb(91, 107, 255);
      border: 1px solid rgb(91, 107, 255);
      transition: all .5s ease-in-out;
    }
    
    .dark .search-icon {
        background-color: #374151; /* gray-700 */
        fill: rgb(129, 140, 248); /* indigo-400 */
        border-color: rgb(129, 140, 248);
    }

    .search-input:focus + .search-icon,
    .search-input:not([value=""]) + .search-icon {
      z-index: 0;
      background-color: transparent;
      border: none;
    }
  `;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView({ type: 'marketplace' });
  };

  return (
    <>
      <style>{searchCSS}</style>
      <header className="fixed top-0 left-0 right-0 z-30 bg-transparent">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center gap-2">
          <div 
            className="text-4xl font-black tracking-wider cursor-pointer text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)]" 
            onClick={() => setView({type: 'marketplace'})}
          >
            MAZ
          </div>
          
          <form onSubmit={handleSearchSubmit} className="search-input-container">
            <input 
              type="text" 
              name="text" 
              className="search-input" 
              placeholder="Search something..." 
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24" className="search-icon">
              <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
              <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g>
              <g id="SVGRepo_iconCarrier"> 
                <rect fill="currentColor" height="24" width="24" className="opacity-0"></rect> 
                <path fill="" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM9 11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5ZM11.5 7C9.01472 7 7 9.01472 7 11.5C7 13.9853 9.01472 16 11.5 16C12.3805 16 13.202 15.7471 13.8957 15.31L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L15.31 13.8957C15.7471 13.202 16 12.3805 16 11.5C16 9.01472 13.9853 7 11.5 7Z" clipRule="evenodd" fillRule="evenodd"></path> 
              </g>
            </svg>
          </form>
        </div>
      </header>
    </>
  );
};

export default SearchBar;
