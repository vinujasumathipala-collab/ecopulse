/**
 * EcoPulse - Supabase Realtime Database Integration
 * Project URL: https://ksovuealolemwlewdzci.supabase.co
 */

const SUPABASE_CONFIG = {
  url: 'https://ksovuealolemwlewdzci.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzb3Z1ZWFsb2xlbXdsZXdkemNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNzQ4MTAsImV4cCI6MjEwNjk1MDgxMH0.q8rpUisafP13XtFwYakYbd7sPv013jmUh0sy2GYTMKs'
};

class SupabaseSyncService {
  constructor() {
    this.url = SUPABASE_CONFIG.url;
    this.key = SUPABASE_CONFIG.anonKey;
    this.restBase = `${this.url}/rest/v1`;
    this.headers = {
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
    this.isConnected = false;
  }

  // Generic REST helpers
  async fetchTable(tableName, query = '') {
    try {
      const res = await fetch(`${this.restBase}/${tableName}${query ? '?' + query : ''}`, {
        headers: this.headers
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      console.warn(`Supabase fetch failed for ${tableName}:`, err);
      return null;
    }
  }

  async insertRecord(tableName, payload) {
    try {
      const res = await fetch(`${this.restBase}/${tableName}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }
      return await res.json();
    } catch (err) {
      console.error(`Supabase insert failed for ${tableName}:`, err);
      return null;
    }
  }

  async updateRecord(tableName, matchCol, matchVal, payload) {
    try {
      const res = await fetch(`${this.restBase}/${tableName}?${matchCol}=eq.${encodeURIComponent(matchVal)}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }
      return await res.json();
    } catch (err) {
      console.error(`Supabase update failed for ${tableName}:`, err);
      return null;
    }
  }

  async deleteRecord(tableName, matchCol, matchVal) {
    try {
      const res = await fetch(`${this.restBase}/${tableName}?${matchCol}=eq.${encodeURIComponent(matchVal)}`, {
        method: 'DELETE',
        headers: this.headers
      });
      return res.ok;
    } catch (err) {
      console.error(`Supabase delete failed for ${tableName}:`, err);
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // Data Mappers (Database Columns <--> Client Store Objects)
  // ---------------------------------------------------------------------------
  mapUserToDb(u) {
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role || 'Resident',
      account_type: u.accountType || 'Residential Account',
      address: u.address || 'Curbside',
      zone: u.zone,
      eco_points: u.ecoPoints || 0,
      total_recycled_kg: u.totalRecycledKg || 0,
      pickups_completed: u.pickupsCompleted || 0,
      status: u.status || 'Active'
    };
  }

  mapUserFromDb(r) {
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      role: r.role,
      accountType: r.account_type,
      address: r.address,
      zone: r.zone,
      ecoPoints: Number(r.eco_points || 0),
      totalRecycledKg: Number(r.total_recycled_kg || 0),
      pickupsCompleted: Number(r.pickups_completed || 0),
      status: r.status,
      registeredOn: r.registered_on
    };
  }

  mapRequestToDb(r) {
    return {
      id: r.id,
      resident_id: r.residentId || null,
      resident_name: r.residentName,
      address: r.address,
      zone: r.zone,
      category: r.category,
      estimated_kg: Number(r.estimatedKg || 10),
      actual_kg: r.actualKg !== null ? Number(r.actualKg) : null,
      pickup_date: r.date,
      time_slot: r.timeSlot,
      status: r.status || 'Submitted',
      assigned_crew: r.assignedCrew || null,
      notes: r.notes || null,
      image_url: r.image || null,
      points_awarded: Number(r.pointsAwarded || 0),
      missed_reason: r.missedReason || null
    };
  }

  mapRequestFromDb(r) {
    return {
      id: r.id,
      residentId: r.resident_id,
      residentName: r.resident_name,
      address: r.address,
      zone: r.zone,
      category: r.category,
      estimatedKg: Number(r.estimated_kg || 0),
      actualKg: r.actual_kg !== null ? Number(r.actual_kg) : null,
      date: r.pickup_date,
      timeSlot: r.time_slot,
      status: r.status,
      assignedCrew: r.assigned_crew,
      notes: r.notes,
      image: r.image_url,
      pointsAwarded: Number(r.points_awarded || 0),
      missedReason: r.missed_reason
    };
  }

  mapCrewToDb(c) {
    return {
      id: c.id,
      name: c.name,
      zone: c.zone,
      truck_id: c.truckId,
      truck_capacity_kg: Number(c.truckCapacityKg || 3500),
      driver: c.driver || null,
      leader: c.leader || null,
      center_manager: c.centerManager || null,
      members: parseInt(c.members, 10) || 3,
      status: c.status || 'Active',
      stops_assigned: Number(c.stopsAssigned || 0),
      stops_completed: Number(c.stopsCompleted || 0),
      on_time_rate: c.onTimeRate || '100%'
    };
  }

  mapCrewFromDb(r) {
    return {
      id: r.id,
      name: r.name,
      zone: r.zone,
      truckId: r.truck_id,
      truckCapacityKg: Number(r.truck_capacity_kg),
      driver: r.driver,
      leader: r.leader,
      centerManager: r.center_manager,
      members: r.members,
      status: r.status,
      stopsAssigned: Number(r.stops_assigned || 0),
      stopsCompleted: Number(r.stops_completed || 0),
      onTimeRate: r.on_time_rate
    };
  }

  mapPersonnelToDb(p) {
    return {
      id: p.id,
      name: p.name,
      role: p.role,
      phone: p.phone,
      email: p.email,
      zone: p.zone,
      assignment: p.assignment,
      status: p.status || 'Active / On Duty'
    };
  }

  mapPersonnelFromDb(r) {
    return {
      id: r.id,
      name: r.name,
      role: r.role,
      phone: r.phone,
      email: r.email,
      zone: r.zone,
      assignment: r.assignment,
      status: r.status
    };
  }

  mapScheduleToDb(s) {
    return {
      id: s.id,
      zone: s.zone,
      stream: s.stream,
      day: s.day,
      time_slot: s.timeSlot,
      crew_name: s.crewName || null,
      notes: s.notes || null
    };
  }

  mapScheduleFromDb(r) {
    return {
      id: r.id,
      zone: r.zone,
      stream: r.stream,
      day: r.day,
      timeSlot: r.time_slot,
      crewName: r.crew_name,
      notes: r.notes
    };
  }

  mapComplaintToDb(c) {
    return {
      id: c.id,
      type: c.type,
      location: c.location,
      zone: c.zone,
      priority: c.priority,
      details: c.details,
      date: c.date,
      status: c.status || 'Open',
      resolution_notes: c.resolutionNotes || null
    };
  }

  mapComplaintFromDb(r) {
    return {
      id: r.id,
      type: r.type,
      location: r.location,
      zone: r.zone,
      priority: r.priority,
      details: r.details,
      date: r.date,
      status: r.status,
      resolutionNotes: r.resolution_notes
    };
  }

  mapFacilityToDb(f) {
    return {
      id: f.id,
      name: f.name,
      type: f.type,
      location: f.location,
      capacity_tons: Number(f.capacityTons || 100),
      current_load_tons: Number(f.currentLoadTons || 0),
      accepted_materials: Array.isArray(f.acceptedMaterials) ? f.acceptedMaterials : [],
      contact_phone: f.contactPhone || null,
      status: f.status || 'Certified Active'
    };
  }

  mapFacilityFromDb(r) {
    return {
      id: r.id,
      name: r.name,
      type: r.type,
      location: r.location,
      capacityTons: Number(r.capacity_tons),
      currentLoadTons: Number(r.current_load_tons),
      acceptedMaterials: r.accepted_materials || [],
      contactPhone: r.contact_phone,
      status: r.status
    };
  }

  mapBatchToDb(b) {
    return {
      id: b.id,
      stream: b.stream,
      weight_kg: Number(b.weightKg),
      source_zone: b.sourceZone,
      facility_id: b.facilityId || null,
      facility_name: b.facilityName || null,
      status: b.status || 'In Yard',
      date: b.date || new Date().toISOString().split('T')[0],
      carrier_vehicle: b.carrierVehicle || null,
      yield_kg: b.yieldKg !== null ? Number(b.yieldKg) : null,
      recovery_rate: b.recoveryRate || null,
      co2_saved_kg: Number(b.co2SavedKg || 0)
    };
  }

  mapBatchFromDb(r) {
    return {
      id: r.id,
      stream: r.stream,
      weightKg: Number(r.weight_kg),
      sourceZone: r.source_zone,
      facilityId: r.facility_id,
      facilityName: r.facility_name,
      status: r.status,
      date: r.date,
      carrierVehicle: r.carrier_vehicle,
      yieldKg: r.yield_kg !== null ? Number(r.yield_kg) : null,
      recoveryRate: r.recovery_rate,
      co2SavedKg: Number(r.co2_saved_kg)
    };
  }

  // ---------------------------------------------------------------------------
  // Full Bi-directional Synchronizer
  // ---------------------------------------------------------------------------
  async pullFromSupabase() {
    this.updateStatusBadge('syncing', 'Connecting to Supabase...');

    try {
      const [
        usersData,
        crewsData,
        personnelData,
        requestsData,
        schedulesData,
        complaintsData,
        facilitiesData,
        batchesData,
        activityData
      ] = await Promise.all([
        this.fetchTable('users'),
        this.fetchTable('crews'),
        this.fetchTable('operations_personnel'),
        this.fetchTable('pickup_requests'),
        this.fetchTable('route_schedules'),
        this.fetchTable('complaints'),
        this.fetchTable('recycling_facilities'),
        this.fetchTable('recyclable_batches'),
        this.fetchTable('activity_feed', 'order=id.desc&limit=25')
      ]);

      if (usersData) {
        this.isConnected = true;
        this.updateStatusBadge('connected', 'Cloud Database Connected');

        // Only populate if cloud has rows, otherwise upload initial local state
        if (usersData.length > 0) {
          store.data.users = usersData.map(u => this.mapUserFromDb(u));
          // If active user is present in cloud, update userProfile
          const matchUser = store.data.users.find(u => u.id === store.data.userProfile.id) || store.data.users[0];
          if (matchUser) {
            store.data.userProfile = { ...matchUser };
          }
        }

        if (crewsData && crewsData.length > 0) {
          store.data.crews = crewsData.map(c => this.mapCrewFromDb(c));
        }

        if (personnelData && personnelData.length > 0) {
          store.data.personnel = personnelData.map(p => this.mapPersonnelFromDb(p));
        }

        if (requestsData && requestsData.length > 0) {
          store.data.requests = requestsData.map(r => this.mapRequestFromDb(r));
        }

        if (schedulesData && schedulesData.length > 0) {
          store.data.schedules = schedulesData.map(s => this.mapScheduleFromDb(s));
        }

        if (complaintsData && complaintsData.length > 0) {
          store.data.complaints = complaintsData.map(c => this.mapComplaintFromDb(c));
        }

        if (facilitiesData && facilitiesData.length > 0) {
          store.data.recyclingFacilities = facilitiesData.map(f => this.mapFacilityFromDb(f));
        }

        if (batchesData && batchesData.length > 0) {
          store.data.recyclableBatches = batchesData.map(b => this.mapBatchFromDb(b));
        }

        if (activityData && activityData.length > 0) {
          store.data.activityFeed = activityData.map(a => ({ text: a.text, time: a.time, dot: a.dot }));
        }

        store.saveState();
        if (typeof renderAllViews === 'function') {
          renderAllViews();
        }
      }
    } catch (err) {
      console.warn('Initial Supabase sync caught error, using local state:', err);
      this.updateStatusBadge('offline', 'Local Cache (Offline)');
    }
  }

  // Real-time Cloud Push Operations
  async pushUser(user) {
    return await this.insertRecord('users', this.mapUserToDb(user));
  }

  async pushRequest(req) {
    return await this.insertRecord('pickup_requests', this.mapRequestToDb(req));
  }

  async updateRequest(req) {
    return await this.updateRecord('pickup_requests', 'id', req.id, this.mapRequestToDb(req));
  }

  async pushCrew(crew) {
    return await this.insertRecord('crews', this.mapCrewToDb(crew));
  }

  async updateCrew(crew) {
    return await this.updateRecord('crews', 'id', crew.id, this.mapCrewToDb(crew));
  }

  async deleteCrew(crewId) {
    return await this.deleteRecord('crews', 'id', crewId);
  }

  async pushPersonnel(p) {
    return await this.insertRecord('operations_personnel', this.mapPersonnelToDb(p));
  }

  async pushSchedule(s) {
    return await this.insertRecord('route_schedules', this.mapScheduleToDb(s));
  }

  async pushComplaint(c) {
    return await this.insertRecord('complaints', this.mapComplaintToDb(c));
  }

  async updateComplaint(c) {
    return await this.updateRecord('complaints', 'id', c.id, this.mapComplaintToDb(c));
  }

  async pushFacility(f) {
    return await this.insertRecord('recycling_facilities', this.mapFacilityToDb(f));
  }

  async pushBatch(b) {
    return await this.insertRecord('recyclable_batches', this.mapBatchToDb(b));
  }

  async updateBatch(b) {
    return await this.updateRecord('recyclable_batches', 'id', b.id, this.mapBatchToDb(b));
  }

  async pushActivity(item) {
    return await this.insertRecord('activity_feed', { text: item.text, time: item.time, dot: item.dot });
  }

  // Update visual badge in navbar
  updateStatusBadge(status, title) {
    const badge = document.getElementById('supabaseStatusBadge');
    const text = document.getElementById('supabaseStatusText');
    const dot = document.getElementById('supabaseStatusDot');
    if (!badge || !text || !dot) return;

    badge.title = title || '';
    if (status === 'connected') {
      badge.style.display = 'inline-flex';
      badge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      badge.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
      badge.style.color = '#10b981';
      dot.style.backgroundColor = '#10b981';
      text.textContent = 'Cloud Sync Live';
    } else if (status === 'syncing') {
      badge.style.display = 'inline-flex';
      badge.style.borderColor = 'rgba(59, 130, 246, 0.4)';
      badge.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
      badge.style.color = '#3b82f6';
      dot.style.backgroundColor = '#3b82f6';
      text.textContent = 'Connecting...';
    } else {
      badge.style.display = 'inline-flex';
      badge.style.borderColor = 'rgba(156, 163, 175, 0.4)';
      badge.style.backgroundColor = 'rgba(156, 163, 175, 0.1)';
      badge.style.color = 'var(--text-muted)';
      dot.style.backgroundColor = 'var(--text-muted)';
      text.textContent = 'Local Cache';
    }
  }
}

// Global singleton instance
window.supabaseSync = new SupabaseSyncService();
