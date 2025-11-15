import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('TipJar', function () {
  it('transfers ERC20 tips to creators', async function () {
    const [owner, creator, tipper] = await ethers.getSigners();
    const token = await ethers.deployContract('TestToken');
    const tipJar = await ethers.deployContract('TipJar', [[await token.getAddress()]]);

    await token.transfer(tipper.address, ethers.parseEther('100'));
    await token.connect(tipper).approve(await tipJar.getAddress(), ethers.parseEther('10'));

    await expect(tipJar.connect(tipper).tip(creator.address, await token.getAddress(), ethers.parseEther('5'), 'post-1'))
      .to.emit(tipJar, 'TipSent')
      .withArgs(tipper.address, creator.address, await token.getAddress(), ethers.parseEther('5'), 'post-1');

    const balance = await token.balanceOf(creator.address);
    expect(balance).to.equal(ethers.parseEther('5'));
  });
});
