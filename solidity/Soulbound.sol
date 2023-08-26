// SPDX-License-Identifier: OSL-3.0
pragma solidity >=0.8.8 <0.9.0;

interface ISoulbound {
    struct TokenData {
        string title;
        string description;
        uint timeCreated;
        uint timeExpiration;
    }

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    event ContractOwnershipTransfer(
        address indexed previousOwner,
        address indexed newOwner
    );

    function getContractOwner() external view returns (address);
    function isRevokable(uint tokenId) external view returns (bool);
    function holderOf(uint tokenId) external view returns (address);
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function mint(
        address soul,
        bool revokable,
        string memory title,
        string memory description,
        uint timeExpiration
    ) external;
    function getData(uint tokenId) external view returns (TokenData memory);
    function revoke(uint tokenId) external;
    function discard(uint tokenId) external;
    function transferContractOwnership(address newOwner) external;
}

// There is a race condition here.
// A solidity function that changes the state (eg. creates a new contract)
// can not also return a value.
// This means that createToken() can not return the address of the newly deployes contract.
// So the user must first deploy a new contract with createToken and then call newContractAdrress()
// to get the address, before another user calls createToken().
// It's not a security risk, it's just annoying.

contract SoulboundFactory {
    address public newContractAddress;
    
    function createToken(string calldata name, string calldata symbol) public {
        newContractAddress = address(new SoulboundToken(name, symbol, msg.sender));
    }
}


contract SoulboundToken is ISoulbound {

    address private _contractOwner;
    string private _tokenName;
    string private _tokenSymbol;

    uint private _nextTokenId;
    mapping(uint=>TokenData) private idToData;
    mapping(uint=>bool) private idToRevokable;
    mapping(uint=>address) private idToSoul;
    
    modifier onlyContractOwner() {
        require(msg.sender == _contractOwner, "Can only be called by contract owner");
        _;
    }

    constructor(string memory tokenName, string memory tokenSymbol, address creator) {
        _contractOwner = creator;
        _tokenName = tokenName;
        _tokenSymbol = tokenSymbol;
    }

    function getContractOwner() external view returns (address) {
        return _contractOwner;
    }

    function isRevokable(uint tokenId) external view returns (bool) {
        return idToRevokable[tokenId];
    }

    function holderOf(uint tokenId) external view returns (address receiver) {
        return idToSoul[tokenId];
    }

    function name() external view returns (string memory) {
        return _tokenName;
    }

    function symbol() external view returns (string memory) {
        return _tokenSymbol;
    }

    /**
    * @dev Timeexpiration set to zero means that the token does not expire.
    */
    function mint(
        address soul,
        bool revokable,
        string memory title,
        string memory description,
        uint timeExpiration
    )
        external
        onlyContractOwner
    {
        require(timeExpiration == 0 || timeExpiration > block.timestamp, "Expiration date must be in the future.");
        _mint(soul, _nextTokenId);
        _setTokenData(_nextTokenId, title, description, timeExpiration);
        idToRevokable[_nextTokenId] = revokable;
        _nextTokenId += 1;
    }
    
    function revoke(uint tokenId) external onlyContractOwner {
        require(idToRevokable[tokenId], "This soulbound token can not be revoked.");
        _burn(tokenId, idToSoul[tokenId]);
    }

    function discard(uint tokenId) external {
        require(msg.sender == idToSoul[tokenId], "Soulbound token can only be discarded by Soul owner.");
        _burn(tokenId, msg.sender);
    }

     /**
    * @dev The interface ID of ISoulbound is 0x62f5c759
    */
    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return
            interfaceId == type(ISoulbound).interfaceId;
    }

    function getData(uint tokenId) external view returns (TokenData memory) {
        require(idToSoul[tokenId] != address(0), "This soulbound token does not exist.");
        return idToData[tokenId];
    }

    function transferContractOwnership(address newContractOwner) external onlyContractOwner {
        require(newContractOwner != address(0), "New Owner can not be zero address");
        emit ContractOwnershipTransfer(_contractOwner, newContractOwner);
        _contractOwner = newContractOwner;
    }

    function _setTokenData(uint tokenId, string memory title, string memory description, uint timeExpiration) internal {
        TokenData memory tokenData = TokenData({title: title,
        description:description,
        timeCreated: block.timestamp,
        timeExpiration: timeExpiration});
        idToData[tokenId] = tokenData;
    }

    function _mint(address soul, uint tokenId) internal {
        emit Transfer(address(0), soul, tokenId);
        idToSoul[tokenId] = soul;
    }

    function _burn(uint tokenId, address soul) internal {
        idToSoul[tokenId] = address(0);
        delete idToData[tokenId];
        idToRevokable[tokenId] = false;
        emit Transfer(soul, address(0), tokenId);
    }

    bytes4 public constant IID_ITEST = type(ISoulbound).interfaceId;
}