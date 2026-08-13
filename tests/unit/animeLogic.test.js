const animeLogic = require('../../utils/animeLogic');
const axios = require('axios');

// Mock to isolate dependencies like APIs
jest.mock('axios');

describe('Anime Logic Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should process valid anime data correctly (Happy Path)', async () => {
        // Arrange
        // Stub to provide fixed test data
        const stubData = { data: { data: { title: "Naruto", popularity: 500 } } };
        axios.get.mockResolvedValue(stubData);
        
        // Spy to verify function calls
        const consoleSpy = jest.spyOn(console, 'log'); 

        // Act
        const result = await animeLogic.processAnimeData(20);

        // Assert
        expect(consoleSpy).toHaveBeenCalledWith('Processing anime ID: 20');
        expect(result.title).toBe('Naruto');
        expect(result.isPopular).toBe(true);
        expect(result.processed).toBe(true);
    });

    test('should handle unpopular anime correctly (Edge Case)', async () => {
        // Arrange
        const stubData = { data: { data: { title: "Unknown Anime", popularity: 5000 } } };
        axios.get.mockResolvedValue(stubData);

        // Act
        const result = await animeLogic.processAnimeData(999);

        // Assert
        expect(result.isPopular).toBe(false);
    });

    test('should return error object on API failure (Edge Case)', async () => {
        // Arrange
        axios.get.mockRejectedValue(new Error("Network Error"));

        // Act
        const result = await animeLogic.processAnimeData(0);

        // Assert
        expect(result.error).toBe("Invalid ID or API Error");
    });
});