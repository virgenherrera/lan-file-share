import { mockAppConfigService } from '../../utils/testing';
import { AppAuthGuard } from './app-auth.guard';

describe('UT:AppAuthGuard', () => {
  const enum should {
    createInstance = 'Should create instance Properly.',
  }

  it(should.createInstance, () => {
    let guard: AppAuthGuard = null;

    expect(
      () => (guard = new AppAuthGuard(mockAppConfigService)),
    ).not.toThrow();
    expect(guard).not.toBeNull();
    expect(guard).toBeInstanceOf(AppAuthGuard);
    expect(guard).toHaveProperty('canActivate');
    expect(guard.canActivate).toBeInstanceOf(Function);
  });
});
