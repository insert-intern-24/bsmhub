import { getGraphQLDataService, Result } from '@/services/client/core/graphqlDataService';
import { profileConfig } from '@/services/config/profileConfig';
import { MultiInputItem } from '@/utils/hook/useInputList';

/**
 * 프로필 특화 GraphQL 서비스
 * 범용 서비스를 감싸는 얇은 래퍼
 */
export class ProfileGraphQLService {
  private dataService = getGraphQLDataService();

  /**
   * 프로필 데이터 로드
   * @param userId - 사용자 ID (owner)
   */
  async loadProfileData(userId: string): Promise<Record<string, MultiInputItem[][] | string[] | boolean | File | null>> {
    try {
      return await this.dataService.loadData(profileConfig, {
        owner: userId,
      });
    } catch (error) {
      console.error('Failed to load profile data:', error);
      throw error;
    }
  }

  /**
   * 프로필 데이터 저장
   * @param formData - React Hook Form 데이터
   * @param userId - 사용자 ID (owner)
   * @param profileId - 프로필 ID (업데이트인 경우)
   */
  async saveProfileData(
    formData: Record<
      string,
      import('@/app/components/modal/inputs/MultiInput').MultiInputItem[][] |
        string[] |
        boolean |
        File |
        number[] |
        null |
        string
    >,
    userId: string,
    profileId?: string
  ): Promise<Result> {
    try {
      // 범용 서비스를 통한 저장
      return await this.dataService.saveData(
        profileConfig,
        formData,
        { owner: userId, is_team: false },
        Boolean(profileId)
      );
    } catch (error) {
      console.error('Failed to save profile data:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // 이름 중복 검사는 현재 사용하지 않음

  /**
   * 프로필 ID로 데이터 로드
   * @param profileId - 프로필 ID
   */
  async loadProfileById(profileId: string): Promise<Record<string, MultiInputItem[][] | string[] | boolean | File | null>> {
    try {
      return await this.dataService.loadData(profileConfig, {
        profile_id: profileId,
      });
    } catch (error) {
      console.error('Failed to load profile by ID:', error);
      throw error;
    }
  }

  /**
   * 프로필 삭제
   * @param profileId - 삭제할 프로필 ID
   */
  async deleteProfile(): Promise<Result> {
    // TODO: 삭제 로직 구현
    return {
      success: false,
      message: 'Delete functionality not implemented yet',
    };
  }
}

// 싱글톤 인스턴스
let serviceInstance: ProfileGraphQLService | null = null;

/**
 * 프로필 GraphQL 서비스 인스턴스 가져오기
 */
export function getProfileGraphQLService(): ProfileGraphQLService {
  if (!serviceInstance) {
    serviceInstance = new ProfileGraphQLService();
  }
  return serviceInstance;
}
