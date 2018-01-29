const {expect} = require('chai');

describe('addTwoNumbers()', function () {
    it('should add two numbers', function () {

        // 1. ARRANGE
        var x = 5;
        var y = 1;
        var sumExp = 6;

        // 2. ACT
        var sumTest = 6;

        // 3. ASSERT
        expect(sumTest).to.be.equal(sumExp);

    });

    it('should add three numbers', () => {


        const x = 1;
        const y = 2;
        const z = 3;

        const sum = 6;


        expect(sum).to.be.equal(7);


    })
});