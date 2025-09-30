

export const SlippageSelector = ({slippageTolerance, setSlippageTolerance}: any) => {
    const presetSlippages = [0.1, 0.5, 1];
  
    return (
      <div className="slippage-selector">
        <h4>Slippage Tolerance</h4>
        <div className="slippage-options">
          {presetSlippages.map(tolerance => (
            <button 
              key={tolerance}
              onClick={() => setSlippageTolerance(tolerance)}
              className={slippageTolerance === tolerance ? 'active' : ''}
            >
              {tolerance}%
            </button>
          ))}
          <input 
            type="number" 
            value={slippageTolerance}
            onChange={(e) => setSlippageTolerance(parseFloat(e.target.value))}
            placeholder="Custom %"
          />
        </div>
      </div>
    );
  };