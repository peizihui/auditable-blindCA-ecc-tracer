pragma solidity ^0.4.18;

//author:rujia
//website:www.rujia.uk
//version:1.0

contract AuditTracer {
 
    // The address of the account that created this ballot.
    address public tracerCreator;
    mapping (address => uint256) private CredentialTraceTimes;
    mapping (address => uint256) private CredentialTraceResults;
    
    mapping (address => uint256) private IdentityTraceTimes;
    mapping (address => uint256) private IdentityTraceResults;
	
	uint public p;
    uint public q;
    uint private xt;
    uint public yt;

    constructor() public {
        tracerCreator = msg.sender;
    }
 
    event trace_log(
        string information,
        address indexed sender,
        uint timestamp,
        uint calltimes,
        uint obj
    );
    
    function credential_tracing_log(uint obj) internal {
         emit trace_log("credential_tracing_log", msg.sender, now, CredentialTraceTimes[msg.sender], obj);
    }
    
    function identity_tracing_log(uint obj) internal {
         // print logs
         emit trace_log("credential_tracing_log", msg.sender, now, IdentityTraceTimes[msg.sender], obj);
    }
	
	function register_parameter(uint _q, uint _N, uint _g, uint _p) public{   
        xt = rand_less_than(_q,_N);
        yt = quick_power(_g,xt,_p);
        p = _p;
        q = _q;
    }
	
	function get_public_key() public view returns(uint){  
		return yt;
	}
	
	function credential_tracing() public returns(uint){
	        CredentialTraceTimes[msg.sender] += 1;
	    return CredentialTraceResults[msg.sender];
	}
	
	function identity_tracing() public returns(uint){
	        IdentityTraceTimes[msg.sender] += 1;
	    return IdentityTraceResults[msg.sender];
	}

	// trace the credential
    function credential_calculating(uint xiupsilon) public returns(uint){
	    if (CredentialTraceTimes[msg.sender] == 0){
            CredentialTraceResults[msg.sender] = quick_power(xiupsilon, xt, p);
        }
        //CredentialTraceTimes[msg.sender] += 1;
        credential_tracing_log(xiupsilon);
    }
    
    // trace the identity
    function identity_calculating(uint zeta1) public{
        if (IdentityTraceTimes[msg.sender] == 0){
            uint nxt = quick_power(xt, q - 2, q);
            IdentityTraceResults[msg.sender] = quick_power(zeta1, nxt, p);
        }
        //IdentityTraceTimes[msg.sender] += 1;
        identity_tracing_log(zeta1);
    }
    
    // Math helper functions
    function rand_less_than(uint upper_bound, uint nbits) private returns(uint){
        uint r = PRNG(nbits);
        if(r < upper_bound){
            return r;
        }
        rand_less_than(upper_bound,nbits);
    }

    function quick_power(uint a, uint b, uint m) private returns(uint){
      uint result = 1;
      for(uint count = 1; count <= b; count*=2){
          if(b & count != 0){
              result = mulmod(result, a, m);
          }
          a = mulmod(a, a, m);
      }
      return result;
    }

    function PRNG(uint nbits) private returns(uint) {
        if(nbits == 40){
            return uint40(uint256(keccak256(abi.encodePacked(msg.sender,now))));
        } else if (nbits == 80){
            return uint80(uint256(keccak256(abi.encodePacked(msg.sender,now))));
        }
        return uint(uint256(keccak256(abi.encodePacked(msg.sender,now))));
        //, blockhash(block.number - 1)
    }
	
}